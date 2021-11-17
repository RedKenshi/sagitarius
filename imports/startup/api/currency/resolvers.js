import Economy from "../economy/economy";

export default {
    Query : {
        currencies(obj, { user }){
            const e = Economy.find({user:user}).fetch();
            return e[0].currencies;
        }
    },
    Mutation : {
        updateStored(obj, { user }){
            const e = Economy.find({user:user}).fetch();
            e[0].currencies.map(c => {
                let newStored = parseInt(parseFloat(c.stored) + (Math.abs(c.lastUpdate - Date.now())/1000)*parseFloat(c.produceMinute/60));
                if(newStored > c.max){
                    newStored = c.max;
                }
                Economy.update(
                    {
                        "user" : user,
                        "currencies.name" : c.name
                    },
                    {
                        "$set" :
                        {
                            "currencies.$.stored" : newStored,
                            "currencies.$.lastUpdate" : new Date()
                        }
                    }
                );
            })
            return true;
        },
        levelupCurrency(obj,{user,currency}){
            const es = Economy.findOne({user:user}).currencies;
            const e = es.filter(x=> x.name == currency)[0];
            let cost = es.filter(x=> x.name == currency)[0].cost;
            for (let i = 1; i <= e.level+1; i++) {
                cost.iron = cost.iron * (1+((2-(2/i))/2.5));
                cost.steel = cost.steel * (1+((2-(2/i))/2.5));
                cost.carbon = cost.carbon * (1+((2-(2/i))/2.5));
                cost.cristal = cost.cristal * (1+((2-(2/i))/2.5));
            }
            const storedIron = es.filter(x=> x.name == 'iron')[0].stored
            const storedSteel = es.filter(x=> x.name == 'steel')[0].stored
            const storedCarbon = es.filter(x=> x.name == 'carbon')[0].stored
            const storedCristal = es.filter(x=> x.name == 'cristal')[0].stored
            if(
                cost.iron < storedIron &&
                cost.steel < storedSteel &&
                cost.carbon < storedCarbon &&
                cost.cristal < storedCristal
            ){
                Economy.update({"user" : user,"currencies.name" : "iron"},{"$set" :{
                    "currencies.$.stored" : storedIron - cost.iron
                }});
                Economy.update({"user" : user,"currencies.name" : "steel"},{"$set" :{
                    "currencies.$.stored" : storedSteel - cost.steel
                }});
                Economy.update({"user" : user,"currencies.name" : "carbon"},{"$set" :{
                    "currencies.$.stored" : storedCarbon - cost.carbon
                }});
                Economy.update({"user" : user,"currencies.name" : "cristal"},{"$set" :{
                    "currencies.$.stored" : storedCristal - cost.cristal
                }});
                for (let i = e.level; i <= e.level+1; i++) {//pb dans le nb d'iteration
                    cost.iron = cost.iron * (1+((2-(2/i))/2.5));
                    cost.steel = cost.steel * (1+((2-(2/i))/2.5));
                    cost.carbon = cost.carbon * (1+((2-(2/i))/2.5));
                    cost.cristal = cost.cristal * (1+((2-(2/i))/2.5));
                }
                const costs = {
                    iron:parseInt(cost.iron),
                    steel:parseInt(cost.steel),
                    carbon:parseInt(cost.carbon),
                    cristal:parseInt(cost.cristal)
                }
                Economy.update(
                    {
                        "user" : user,
                        "currencies.name" : e.name
                    },
                    {
                        "$set" :
                        {
                            "currencies.$.level" : e.level+1,
                            "currencies.$.produceMinute" : parseInt(e.produceMinute*(1+(((2-(2/(e.level+1)))/2.5)-0.2))),
                            "currencies.$.cost" : costs
                        }
                    }
                );
            }
        }
    }
}