const userController = require('../../Controller/UserController.js');

const userDao = require('../../Model/UserDao.js');

jest.mock('../../Model/UserDao.js');


describe('UserController.createOrUpdate', () => {
    //Mock req and res for testing createorupdate
    let req, res;
    beforeEach(() => {
        req = {
            body: {
                username: 'testUser',
                password: '12345',
                email: 'test@example.com',
                phone: '555-5555',
                permission: 1,
                name: 'Test User',
                role: 'coach',
                team: 'someTeamId',
            },
            params: {
                username: 'testUser',
                password: '12345',
                email: 'test@example.com',
                phone: '555-5555',
                permission: 1,
                name: 'Test User',
                role: 'coach',
                team: 'someTeamId',
            },
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        jest.clearAllMocks();
    });


    test('should create a user and return 201 with the created user', async () => {
    // Arrange
        const mockUser = { _id: 'mockuser', ...req.body };
        userDao.create.mockResolvedValue(mockUser);

        // Act
        await userController.createOrUpdate(req, res);

        // Assert
        expect(userDao.create).toHaveBeenCalledWith({
            username: 'testUser',
            password: '12345',
            email: 'test@example.com',
            phone: '555-5555',
            permission: 1,
            name: 'Test User',
            role: 'coach',
            team: 'someTeamId',
            timeCreated: undefined, // because it's not provided in req.body
        });

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith(mockUser);
  });

    test('throw error for create failing; return 500', async () => {
        const error = new Error("Error with Database");
        userDao.create.mockRejectedValue(error);

        await userController.createOrUpdate(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: 'Failed to create/update user'});
    })
    //DeleteOne tests
    test('return 200 if user deleted successfully', async () =>  {
        const testDeletedUser = { username: 'testUser'};
        userDao.delete.mockResolvedValue(testDeletedUser);

        await userController.deleteOne(req, res);

        expect(userDao.delete).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: 'User deleted successfully'});
    })

    test('returns 404 if user not found', async () => {
        userDao.delete.mockResolvedValue(null);

        await userController.deleteOne(req, res);

        expect(userDao.delete).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found' });
    });

    test('returns 500 on dao error', async () => {
        userDao.delete.mockRejectedValue(new Error('DB error'));

        await userController.deleteOne(req, res);

        expect(userDao.delete).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Failed to delete user' });
    });

    //DeleteAll
    test('return 200 for success on deleteAll', async () => { 
        await userController.deleteAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({message: "All users deleted successfully"});
    })
    test('return 500 for fail on deleteAll', async () => { 
        userDao.deleteAll.mockRejectedValue(new Error('DB error'));
        await userController.deleteAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Failed to delete all users"});
    })

    //Getall
    test('return 200 for success on getAll', async() => {
        const mockUsersArray = [
            {username: 'test1', email: 'test1@test.com' },
            {username: 'test2', email: 'test2@test.com' }
        ];

        userDao.readAll.mockResolvedValue(mockUsersArray);
        await userController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUsersArray);
    })

    test('return 500 for fail on getAll', async() => {
        userDao.readAll.mockRejectedValue(new Error('DB error'));

        await userController.getAll(req, res);

        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Failed to retrieve users"});
    })
    //GetByName
    test('return 200 for success on getByName', async() => {
        //BeforeAll was messing up the test, so I changed it specifically for this test.
        req = { params: { name: 'testUser' } };
        
        const byNameUser = { username: 'testUser'};
        userDao.readByName.mockResolvedValue(byNameUser);

        await userController.getByName(req, res);

        expect(userDao.readByName).toHaveBeenCalledWith('testUser'); 
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(byNameUser);     });


    test('return 500 for fail on getByName', async() => {
        req = { params: { name: 'testUser' } };
        const dbError = new Error('DB error');
        
        userDao.readByName.mockRejectedValue(dbError);

        await userController.getByName(req, res);

        expect(userDao.readByName).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Error retrieving user"});
    });
       test('return 200 for success on getOneUser', async() => {
        const mockUser = { username: 'testUser', email: 'test@example.com', _id: 'someid'};
        userDao.read.mockResolvedValue(mockUser);

        await userController.getOneUser(req, res);

        expect(userDao.read).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith(mockUser);
    })

    test('return 404 if user not found on getOneUser', async() => {
        userDao.read.mockResolvedValue(null);

        await userController.getOneUser(req, res);

        expect(userDao.read).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ error: 'User not found'});
    })
    
    test('return 500 for fail on getOneUser', async() => {
        userDao.read.mockRejectedValue(new Error('DB error'));

        await userController.getOneUser(req, res);

        expect(userDao.read).toHaveBeenCalledWith('testUser');
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({error: "Error retrieving user"});
    })

    
});

