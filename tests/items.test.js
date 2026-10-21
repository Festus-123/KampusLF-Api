import { beforeEach, describe, expect, it, vi } from 'vitest';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app/app.js';
import { ItemService } from '../src/services/items/itemsService.js';

vi.mock('../src/services/items/itemsService.js', () => ({
	ItemService: {
		getAllLostItems: vi.fn(),
		getMyLostItems: vi.fn(),
		getLostItemsPage: vi.fn(),
		getLostItemById: vi.fn(),
		createLostItem: vi.fn(),
		updateLostItem: vi.fn(),
		deleteLostItem: vi.fn(),
	},
}));

const jwtSecret = 'items-test-secret';
process.env.JWT_SECRET = jwtSecret;

const authHeader = () => ({
	Authorization: `Bearer ${jwt.sign({ sub: '42', email: 'user@example.com' }, jwtSecret)}`,
});

describe('Items endpoints', () => {
	beforeEach(() => {
		vi.resetAllMocks();
	});

	it('returns all items with a 200 response', async () => {
		const items = [{ id: 1, name: 'Keys' }];
		ItemService.getAllLostItems.mockResolvedValue(items);

		const response = await request(app).get('/api/v1/items');

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(items);
	});

	it('passes pagination query values to the service', async () => {
		const page = { items: [{ id: 1 }], total: 1 };
		ItemService.getLostItemsPage.mockResolvedValue(page);

		const response = await request(app).get('/api/v1/items/page?offset=3&limit=7');

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(page);
		expect(ItemService.getLostItemsPage).toHaveBeenCalledWith('3', '7');
	});

	it('returns an item by id', async () => {
		const item = { id: 9, name: 'Wallet' };
		ItemService.getLostItemById.mockResolvedValue(item);

		const response = await request(app).get('/api/v1/items/9');

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(item);
		expect(ItemService.getLostItemById).toHaveBeenCalledWith('9');
	});

	it('requires authentication to list the current user items', async () => {
		const response = await request(app).get('/api/v1/items/mine');

		expect(response.status).toBe(401);
		expect(response.body).toStrictEqual({
			error: 'Missing or malformed Authorization header',
		});
		expect(ItemService.getMyLostItems).not.toHaveBeenCalled();
	});

	it('lists the authenticated user items', async () => {
		const items = [{ id: 4, name: 'Notebook' }];
		ItemService.getMyLostItems.mockResolvedValue(items);

		const response = await request(app)
			.get('/api/v1/items/mine')
			.set(authHeader());

		expect(response.status).toBe(200);
		expect(response.body).toStrictEqual(items);
		expect(ItemService.getMyLostItems).toHaveBeenCalledWith('42');
	});

	it('creates an item for the authenticated user', async () => {
		const itemInput = { name: '  Keys ', tag: '  Accessories ', properties: ['Blue'] };
		const item = { id: 3, name: 'Keys', tag: 'Accessories', properties: ['Blue'] };
		ItemService.createLostItem.mockResolvedValue(item);

		const response = await request(app)
			.post('/api/v1/items')
			.set(authHeader())
			.send(itemInput);

		expect(response.status).toBe(201);
		expect(response.body).toStrictEqual(item);
		expect(ItemService.createLostItem).toHaveBeenCalledWith({ ...itemInput, userId: '42' });
	});

	it('rejects invalid item data before calling the service', async () => {
		const response = await request(app)
			.post('/api/v1/items')
			.set(authHeader())
			.send({ name: '', tag: 'Accessories', properties: [] });

		expect(response.status).toBe(400);
		expect(response.body.error).toBe('Invalid data');
		expect(ItemService.createLostItem).not.toHaveBeenCalled();
	});

	it('updates and deletes an item for an authenticated user', async () => {
		const updatedItem = { id: 3, name: 'Blue keys' };
		const deletedItem = { id: 3, name: 'Blue keys' };
		ItemService.updateLostItem.mockResolvedValue(updatedItem);
		ItemService.deleteLostItem.mockResolvedValue(deletedItem);

		const updateResponse = await request(app)
			.patch('/api/v1/items/3')
			.set(authHeader())
			.send({ name: 'Blue keys' });
		const deleteResponse = await request(app)
			.delete('/api/v1/items/3')
			.set(authHeader());

		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body).toStrictEqual(updatedItem);
		expect(ItemService.updateLostItem).toHaveBeenCalledWith('3', '42', { name: 'Blue keys' });
		expect(deleteResponse.status).toBe(200);
		expect(deleteResponse.body).toStrictEqual(deletedItem);
		expect(ItemService.deleteLostItem).toHaveBeenCalledWith('3', '42');
	});
});
