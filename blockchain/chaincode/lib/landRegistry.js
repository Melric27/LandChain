'use strict';

const { Contract } = require('fabric-contract-api');

class LandRegistry extends Contract {

    // ── Initialize Ledger ──────────────────────────
    async InitLedger(ctx) {
        console.log('LandChain chaincode initialized');
    }

    // ── Register a new property ────────────────────
    async RegisterProperty(ctx, propertyId, ownerName, ownerId, location, area, estimatedValue) {
        const exists = await this.PropertyExists(ctx, propertyId);
        if (exists) {
            throw new Error(`Property ${propertyId} already exists`);
        }

        const property = {
            propertyId,
            ownerName,
            ownerId,
            location,
            area,
            estimatedValue,
            hasEncumbrance: false,
            encumbranceDetails: null,
            inheritancePending: false,
            heirId: null,
            status: 'ACTIVE',
            registeredAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString()
        };

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('PropertyRegistered', Buffer.from(JSON.stringify({
            propertyId,
            ownerName,
            ownerId,
            timestamp: property.registeredAt
        })));

        return JSON.stringify(property);
    }

    // ── Get a property ─────────────────────────────
    async GetProperty(ctx, propertyId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }
        return propertyJSON.toString();
    }

    // ── Transfer ownership ─────────────────────────
    async TransferOwnership(ctx, propertyId, newOwnerName, newOwnerId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }

        const property = JSON.parse(propertyJSON.toString());

        // Block if encumbered
        if (property.hasEncumbrance) {
            throw new Error(`Property ${propertyId} has an active encumbrance and cannot be transferred`);
        }

        // Block if inheritance pending
        if (property.inheritancePending) {
            throw new Error(`Property ${propertyId} has a pending inheritance and cannot be transferred`);
        }

        const previousOwner = property.ownerName;
        const previousOwnerId = property.ownerId;

        property.ownerName = newOwnerName;
        property.ownerId = newOwnerId;
        property.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('OwnershipTransferred', Buffer.from(JSON.stringify({
            propertyId,
            previousOwner,
            previousOwnerId,
            newOwner: newOwnerName,
            newOwnerId,
            timestamp: property.lastUpdated
        })));

        return JSON.stringify(property);
    }

    // ── Add encumbrance (mortgage/lien) ───────────
    async AddEncumbrance(ctx, propertyId, bankName, bankId, loanAmount, loanId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }

        const property = JSON.parse(propertyJSON.toString());

        if (property.hasEncumbrance) {
            throw new Error(`Property ${propertyId} already has an active encumbrance`);
        }

        property.hasEncumbrance = true;
        property.encumbranceDetails = {
            bankName,
            bankId,
            loanAmount,
            loanId,
            encumberedAt: new Date().toISOString()
        };
        property.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('EncumbranceAdded', Buffer.from(JSON.stringify({
            propertyId,
            bankName,
            loanAmount,
            timestamp: property.lastUpdated
        })));

        return JSON.stringify(property);
    }

    // ── Release encumbrance ────────────────────────
    async ReleaseEncumbrance(ctx, propertyId, loanId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }

        const property = JSON.parse(propertyJSON.toString());

        if (!property.hasEncumbrance) {
            throw new Error(`Property ${propertyId} has no active encumbrance`);
        }

        if (property.encumbranceDetails.loanId !== loanId) {
            throw new Error(`Loan ID mismatch — cannot release encumbrance`);
        }

        property.hasEncumbrance = false;
        property.encumbranceDetails = null;
        property.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('EncumbranceReleased', Buffer.from(JSON.stringify({
            propertyId,
            loanId,
            timestamp: property.lastUpdated
        })));

        return JSON.stringify(property);
    }

    // ── Trigger inheritance ────────────────────────
    async TriggerInheritance(ctx, propertyId, heirName, heirId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }

        const property = JSON.parse(propertyJSON.toString());

        if (property.inheritancePending) {
            throw new Error(`Inheritance already pending for property ${propertyId}`);
        }

        property.inheritancePending = true;
        property.heirId = heirId;
        property.heirName = heirName;
        property.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('InheritanceTriggered', Buffer.from(JSON.stringify({
            propertyId,
            currentOwner: property.ownerName,
            heirName,
            heirId,
            timestamp: property.lastUpdated
        })));

        return JSON.stringify(property);
    }

    // ── Complete inheritance ───────────────────────
    async CompleteInheritance(ctx, propertyId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        if (!propertyJSON || propertyJSON.length === 0) {
            throw new Error(`Property ${propertyId} does not exist`);
        }

        const property = JSON.parse(propertyJSON.toString());

        if (!property.inheritancePending) {
            throw new Error(`No pending inheritance for property ${propertyId}`);
        }

        property.ownerName = property.heirName;
        property.ownerId = property.heirId;
        property.inheritancePending = false;
        property.heirId = null;
        property.heirName = null;
        property.lastUpdated = new Date().toISOString();

        await ctx.stub.putState(propertyId, Buffer.from(JSON.stringify(property)));

        ctx.stub.setEvent('InheritanceCompleted', Buffer.from(JSON.stringify({
            propertyId,
            newOwner: property.ownerName,
            timestamp: property.lastUpdated
        })));

        return JSON.stringify(property);
    }

    // ── Get full property history ──────────────────
    async GetPropertyHistory(ctx, propertyId) {
        const iterator = await ctx.stub.getHistoryForKey(propertyId);
        const history = [];

        let result = await iterator.next();
        while (!result.done) {
            const record = {
                txId: result.value.txId,
                timestamp: new Date(result.value.timestamp.seconds.low * 1000).toISOString(),
                isDelete: result.value.isDelete,
                data: result.value.value.toString('utf8')
            };
            history.push(record);
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify(history);
    }

    // ── Check if property exists ───────────────────
    async PropertyExists(ctx, propertyId) {
        const propertyJSON = await ctx.stub.getState(propertyId);
        return propertyJSON && propertyJSON.length > 0;
    }

    // ── Get all properties ─────────────────────────
    async GetAllProperties(ctx) {
        const iterator = await ctx.stub.getStateByRange('', '');
        const properties = [];

        let result = await iterator.next();
        while (!result.done) {
            properties.push(JSON.parse(result.value.value.toString('utf8')));
            result = await iterator.next();
        }
        await iterator.close();

        return JSON.stringify(properties);
    }
}

module.exports = LandRegistry;