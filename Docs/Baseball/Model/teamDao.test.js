const teamModule = require('./teamDao');
const dbConnect = require("../../../DBConnection.js");
require("dotenv").config();

beforeAll(async () => {

    await dbConnect.connect(test);

});

afterAll(async () => {

    await dbConnect.disconnect();
});


afterEach(async () => {
    await teamModule.deleteAll();
});



test('should create a team', async () => {
    const newTeam = {
      name: 'Loyola',
      players: ['Dylan', 'Fabrizio'],
      coach: 'Coach Smith',
      wins: 5,
      losses: 2,
      ties: 1,
    };

    const team = await teamModule.create(newTeam);

    expect(team).toBeDefined();
    expect(team.name).toBe('Loyola');
    expect(team.players.length).toBe(2);
});

test('should read a team by id', async () => {
    const created = await teamModule.create({ name: 'Team A' });
    const found = await teamModule.read(created._id);

    expect(found).not.toBeNull();
    expect(found.name).toBe('Team A');
});

test('should read a team by name', async () => {
    await teamModule.create({ name: 'Team B' });
    const found = await teamModule.readByName('Team B');

    expect(found).not.toBeNull();
    expect(found.name).toBe('Team B');
});

test('should read all teams', async () => {
    await teamModule.create({ name: 'Team 1' });
    await teamModule.create({ name: 'Team 2' });

    const teams = await teamModule.readAll();

    expect(teams.length).toBe(2);
});

test('should update a team by name', async () => {
    await teamModule.create({ name: 'Team X', wins: 0 });
    await teamModule.update('Team X', { wins: 3 });

    const updated = await teamModule.readByName('Team X');
    expect(updated.wins).toBe(3);
});

test('should delete a team by id', async () => {
    const team = await teamModule.create({ name: 'DeleteTest' });
    const deleted = await teamModule.del(team._id);
    const found = await teamModule.read(team._id);

    expect(deleted.name).toBe('DeleteTest');
    expect(found).toBeNull();
});

test('should delete all teams', async () => {
    await teamModule.create({ name: 'A' });
    await teamModule.create({ name: 'B' });

    await teamModule.deleteAll();
    const teams = await teamModule.readAll();

    expect(teams.length).toBe(0);
});



