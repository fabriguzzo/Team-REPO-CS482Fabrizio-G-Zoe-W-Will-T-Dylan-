import mongoose from 'mongoose';
export class Team{
    name;

    
    //schemas
    recordSchema;
    teamSchema;
   

    //team attributes
    players;
    coach;
    manager;
    record;
    schedule;
    logo;

    //models
    recordModel;
    teamModel;
    
  

    constructor(name){
    
        this.name = name;

        this.players = [];

        this.coach = '';
        
        this.manager = '';

        this.record = new Map();

        this.schedule = [];

        this.logo = '';

        this.recordSchema = new mongoose.Schema({
            win: { type: Number, default: 0 },
            tie: { type: Number, default: 0 },
            loss: { type: Number, default: 0 },
        });

        this.teamSchema = new mongoose.Schema({
            name: { type: String, required: true, unique: true },
            players: [{ type: String }],
            coach: { type: String },
            manager: { type: String },
            logo: { type: String },
            record: this.recordSchema,
            schedule: [{ type: String }]
        });

        this.teamModel = mongoose.model('Team', this.teamSchema);
        this.recordModel = mongoose.model('Record', this.recordSchema);
    
    }
    
    //adds a player to players list in team map
    
    addPlayer(player){
    

        this.players.push(player);
    
    }
    
    //deletes a player from players list in team map
    
    deletePlayer(player){
    
       
    
        let index = players.indexOf(player);
    
        if (index !== -1) {
    
            players.splice(index, 1);
    
        }
    
    }
    
    //assigns a coach to the Coach in team map
    
    assignCoach(coach){
    
        
        this.coach = coach;
    
    }
    
    //assigns manger to the Manager in team map
    
    assignManager(manager){
    
        

        this.manager = manager;
    
    }
    
    //assigns a logo to the Logo in team map
    
    assignLogo(logo){
    
        this.logo = logo;
    
    }
    
    //assigns a map record to Record in team map
    
    assignRecord(win,tie,loss){
    
        
    
        this.record.set('Wins',win);
    
        this.record.set('Losses',loss);
    
        this.record.set('Ties',tie);
    
    
        
    
    }
    
    //assigns a ordered list of teams to Schedule in team map
    
    assignSchedule(teams){
    
        //this.team.set('Schedule',teams);
        this.schedule = teams;
    
    }

    getTeamModel(){
        return this.teamModel;
    }
    
    getTeamDoc(){
        const recordDoc = new this.recordModel({
            win: this.record.get('Wins'),
            tie: this.record.get('Ties'),
            loss: this.record.get('Losses')
        });

        const teamDoc = new this.teamModel({
            name: this.name,
            players: this.players,
            coach: this.coach,
            manager: this.manager,
            logo: this.logo,
            record: recordDoc,
            schedule: this.schedule
        });



        return teamDoc;
    }

    
    
    
    
}
