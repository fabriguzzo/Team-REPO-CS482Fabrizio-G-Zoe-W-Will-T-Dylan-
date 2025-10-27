const controller = require("./teamController"); 
const dao = require("../Model/teamDao");

// Mock the DAO module
jest.mock('../Model/teamDao');

beforeEach(() => {
  jest.clearAllMocks();
});

test('Get All Teams', async function() {
  let req = {};
  let res = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn()
  };

  dao.readAll.mockResolvedValue([{ name: 'Loyola' }]);
  await controller.getAll(req, res);

  expect(dao.readAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith([{ name: 'Loyola' }]);
});


test('Get One Team', async function() {
  let req = { params: { id: '1' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue({ _id: '1', name: 'Loyola' });
  await controller.getOne(req, res);

  expect(dao.read).toHaveBeenCalledWith('1');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ _id: '1', name: 'Loyola' });
});

test('Get One Team - Not Found', async function() {
  let req = { params: { id: '1' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.read.mockResolvedValue(null);
  await controller.getOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
});


test('Create Team', async function() {
  let req = {
    body: { name: 'New Team', manager: 'Coach A', logo: 'img.png' }
  };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.create.mockResolvedValue({ name: 'New Team' });
  await controller.createOrUpdate(req, res);

  expect(dao.create).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(201);
  expect(res.json).toHaveBeenCalledWith({ name: 'New Team' });
});

test('Delete One - Success', async function() {
  let req = { params: { id: '1' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(true);

  await controller.deleteOne(req, res);

  expect(dao.del).toHaveBeenCalledWith('1');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'Team deleted successfully' });
});

test('Delete One - Not Found', async function() {
  let req = { params: { id: '1' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.del.mockResolvedValue(false);

  await controller.deleteOne(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
});

test('Delete All Teams', async function() {
  let req = {};
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  
  dao.deleteAll.mockResolvedValue();

  await controller.deleteAll(req, res);

  expect(dao.deleteAll).toHaveBeenCalled();
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ message: 'All teams deleted successfully' });
});


test('Get Team By Name', async function() {
  let req = { params: { name: 'Loyola' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByName.mockResolvedValue({ name: 'Loyola' });
  await controller.getByName(req, res);

  expect(dao.readByName).toHaveBeenCalledWith('Loyola');
  expect(res.status).toHaveBeenCalledWith(200);
  expect(res.json).toHaveBeenCalledWith({ name: 'Loyola' });
});

test('Get Team By Name - Not Found', async function() {
  let req = { params: { name: 'Nope' } };
  let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

  dao.readByName.mockResolvedValue(null);
  await controller.getByName(req, res);

  expect(res.status).toHaveBeenCalledWith(404);
  expect(res.json).toHaveBeenCalledWith({ error: 'Team not found' });
});

test('Get Team By Name - Error', async function() {
    let req = { params: { name: 'Bad' } };
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    dao.readByName.mockRejectedValue(new Error('DB fail'));
    await controller.getByName(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving team' });
});

test('Create Team - Error', async function() {
    let req = {
      body: { name: 'Bad Team', manager: 'X', logo: 'img.png' }
    };
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    dao.create.mockRejectedValue(new Error('fail'));
    await controller.createOrUpdate(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to create or update team' });
});

test('Get One Team - Error', async function() {
    let req = { params: { id: '1' } };
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    dao.read.mockRejectedValue(new Error('DB fail'));
    await controller.getOne(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Error retrieving team' });
});

test('Get All Teams - Error', async function() {
    let req = {};
    let res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
  
    dao.readAll.mockRejectedValue(new Error('DB error'));
    await controller.getAll(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to retrieve teams' });
});

test('Delete One - Error', async function() {
    let req = { params: { id: '1' } };
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    
    dao.del.mockRejectedValue(new Error('DB fail'));
  
    await controller.deleteOne(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete team' });
});
  
  test('Delete All Teams - Error', async function() {
    let req = {};
    let res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
  
    
    dao.deleteAll.mockRejectedValue(new Error('DB fail'));
  
    await controller.deleteAll(req, res);
  
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete all teams' });
});

  
