export class Team{
    name;
    players;
    coach;
    manager;
    record;
    schedule;
    logo;

    constructor(name){
    
        this.name = name;

        this.players = [];

        this.coach;
    
        //this.team = new Map();
    
        //this.team.set('Players', []);
        
        this.manager;

        this.record;

        this.schedule;

        this.logo;
    
    }
    
    //adds a player to players list in team map
    
    addPlayer(player){
    
        //let players = this.team.get('Players');
    
        //players.push(player);

        this.players.push(player);
    
    }
    
    //deletes a player from players list in team map
    
    deletePlayer(player){
    
        //let players = this.team.get('Players');
    
        let index = players.indexOf(player);
    
        if (index !== -1) {
    
            players.splice(index, 1);
    
        }
    
    }
    
    //assigns a coach to the Coach in team map
    
    assignCoach(coach){
    
        //this.team.set('Coach',coach);
        this.coach = coach;
    
    }
    
    //assigns manger to the Manager in team map
    
    assignManager(manager){
    
        //this.team.set('Manager',manager);

        this.manager = manager;
    
    }
    
    //assigns a logo to the Logo in team map
    
    assignLogo(logo){
    
        //this.team.set('Logo',logo);
        this.logo = logo;
    
    }
    
    //assigns a map record to Record in team map
    
    assignRecord(win,tie,loss){
    
        let record = new Map();
    
        record.set('Wins',win);
    
        record.set('Losses',loss);
    
        record.set('Ties',tie);
    
        //this.team.set('Record',record);
        this.record = record;
    
    }
    
    //assigns a ordered list of teams to Schedule in team map
    
    assignSchedule(teams){
    
        //this.team.set('Schedule',teams);
        this.schedule = teams;
    
    }
    //might need work

    //returns a Map of key as the team name and value as team attributes

    //getTeam(){  

        //let team = new Map();
    
        //team.set(this.name, this.team);
    
        //return team;
    
   //}
    
    
    
} 
    
