import express, {Express, NextFunction, Request, Response} from "express";
import {config} from "dotenv";
import Stripe from "stripe";
config({path:"./.env"});
if(!process.env) throw new Error (".env did not load");
import fb_admin from "firebase-admin";
import * as serviceAccount from "./fb_secret_key.json";
import { Database } from "firebase-admin/lib/database/database";
import cors from "cors";
import bodyParser from "body-parser";
import crypto from "crypto"
import Filter from 'bad-words';
import fs from "fs";
import path from "path"; // Necessary for using frontend

const filter1 = new Filter();
var secretUrl = process.env.databaseUrl?.toString();
fb_admin.initializeApp({
    credential: fb_admin.credential.cert(serviceAccount as fb_admin.ServiceAccount),
    databaseURL: secretUrl,
})
const db:Database = fb_admin.database();
// const auth:Auth = fb_admin.auth();
const app:Express = express();
let uid:string|undefined;
let user_data:any;
const port:number = process.env.PORT ? parseInt(process.env.PORT) : 9000;
if(process.env.STRIPE_SECRET_KEY == null) throw new Error("No Stripe Secret Key in .env");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
app.use(bodyParser.json({ limit: '50mb' })); // Adjust the limit as needed
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cors()); 
app.use((req, res, next) => {
    // Generate a nonce
    const nonce = crypto.randomBytes(16).toString('base64');
  
    // Set CSP header with nonce
    res.setHeader(
      'Content-Security-Policy',
      `default-src 'self'; connect-src * 'self'; script-src 'self' https://cdn.firebase.com https://*.firebaseio.com https://www.gstatic.com/gtag/ https://www.gstatic.com/firebasejs/ 'nonce-${nonce}'; object-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com; img-src 'self' data:; font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com; frame-src * 'self' https://*.firebaseio.com`
    );
  
    // Attach nonce to response.locals to be used in views
    res.locals.nonce = nonce;
    next();
  });// Serve static files from the `browser` folder

const validateFirebaseIdToken = async (req:Request, res:Response, next:NextFunction) => {
    const headerToken = req.headers.authorization;
    // console.log(headerToken)
    if (!headerToken || !headerToken.startsWith('Bearer ')) {
        // always one undefined request send
        return res.status(403).json({ error: 'Unauthorized' }).end();
    }
    const idToken = headerToken.split('Bearer ')[1];
    try {
        await fb_admin.auth().verifyIdToken(idToken).then(status => {
            return status != null ? next() : res.status(405).json({error:"ID´s do not align"}).end(); 
        })
    //   req.user = decodedToken;
        
    } catch (error) {
        console.error('Error validating token:', error);
        return res.status(403).json({ error: 'Unauthorized' });
    }
};

export async function wordFilter(userName: string): Promise<boolean> {
    const isClean1 = !filter1.isProfane(userName);
    const fileContent = await fs.promises.readFile("./swearwords.txt", "utf-8");
    const names = await getNames();
    const nameExist = !Object.prototype.hasOwnProperty.call(names, userName.toLowerCase());
    const words = fileContent.split(/\s+|[,."';:!?]+/);
    const found = words.some((word:any) => word.toLowerCase() === userName.toLowerCase());
    if (!found && isClean1 && nameExist) {
        await storeName(userName, names);
        return true;
    } else {
        return false;
    }
}

export async function getNames(): Promise<{ [key: string]: boolean }> {
    try {
        // Fetch current names object from Firebase
        const namesSnapshot = await db.ref('/Names').get();
        const names = namesSnapshot.val(); // Retrieve the current object of names
        console.log("Returning Names");
        if (names !== null && typeof names === 'object') {
            return names; // Return the object of names
        } else {
            console.log("'/Names' node does not exist or is not an object.");
            return {}; // Return an empty object
        }
    } catch (error) {
        console.error('Error fetching names:', error);
        throw error; // Throw the error to be handled by the caller
    }
}

export async function storeName(name: string, allNames: { [key: string]: boolean }): Promise<void> {
    try {
        // Add the new name to the names object
        allNames[name.toLowerCase()] = true;
        console.log("Storing new name:", name);
        await db.ref('/Names').set(allNames); // Update the Firebase node
    } catch (e: any) {
        console.error("Error:", e.message);
    }
}  
app.get("/api/getUsers", async (req:Request, res:Response) => {
    try {
      const snapshot = await db.ref("/Users").get();
      if (snapshot.exists()) {
        const allUsers = snapshot.val();
        const usersData = Object.keys(allUsers).map(uid => {
          const userData = allUsers[uid];
          var profile_pic = userData.profile_pic;
          if(typeof profile_pic === "number") {
            if(profile_pic ==0) {profile_pic = "assets/img/profilePic1.jpeg";}
            else {profile_pic = "assets/img/profilePic2.jpeg";}
          } 
          return {
            Points: userData.Points,
            count: userData.count,
            Name: userData.Name,
            profile_pic:profile_pic,
          };
        });
        res.status(200).json(usersData);  // Ensure response is JSON with 'data' property
      } else {
        res.status(404).json({ message: "User not found" });  // JSON error response
      }
    } catch (e) {
        console.log("Error")
        res.status(403).json({message:"Error in backend"})
    }
})
app.post("/api/user-information", validateFirebaseIdToken, async (req, res) => {
    try {
        uid  = req.body.uid;
        user_data = req.body.user_data
        // Validate the presence of uid and user_data
        if (!uid || !user_data) {
            return res.status(400).json({ error: "Missing uid or user_data in request body" });
        }

        var dataRef = db.ref(`Users/${uid}`);
        if (!user_data.started) {
            var today = new Date();
            await dataRef.update({
                started: today,
                left_days: 15,
            });
            user_data.started = today;
        } else if (user_data.started && user_data.payment == null) {
            let userCountDay:any = new Date(user_data.started);
            let currentDate:any = new Date();
            let timeDifference = currentDate - userCountDay; // Difference in milliseconds
            const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
            if (timeDifference > millisecondsIn24Hours && user_data.left_days > 0) {
                await dataRef.update({
                    left_days: user_data.left_days - 1,
                });
                user_data.left_days -= 1; // Update the local variable as well
            }
        }

        if (user_data.count && user_data.started) {
            let userCountDay:any = new Date(user_data.count.day);
            let currentDate:any = new Date();
            let timeDifference = currentDate - userCountDay; // Difference in milliseconds
            const millisecondsIn24Hours = 24 * 60 * 60 * 1000;
            if (timeDifference > millisecondsIn24Hours || !user_data.count.day) {
                var count_db = {
                    change: true,
                    day: currentDate, // Set the current date as the new count day
                    number: user_data.count.number,
                };
                await db.ref(`Users/${uid}/count`).update(count_db);
                user_data.count.day = currentDate; // Update the local variable as well
            }
        }

        res.json({
            message: "User initialized in backend",
            count_obj: user_data.count,
        });
        res.status(200).end();
    } catch (e) {
        res.status(400).end("Error in initialization:" + e);
        throw new Error("Error in user_info init:" + e);
    }
});

  
app.post("/api/register", async (req, res) => {
    try {
        const userName = req.body.name;
        let valid = await wordFilter(userName);
        console.log(valid)
        if(valid) {
            res.status(200).send({status:true, name:userName});
        }else {
            res.status(200).send({status:false});
        }
    }   
    catch(e) {
        res.status(401).end();
        throw new Error ("Error in register backend: "+e);
    }
})
app.post("/api/count", validateFirebaseIdToken, async (req, res) => {
    try {
        if(user_data && uid) {
        let new_count = user_data.count.number + 1;
        let currentDate = new Date(); // Get the current date and time
        var new_count_obj = {
            number:new_count,
            change:false,
            day:currentDate,
        }
        await db.ref(`Users/${uid}/count`).update(new_count_obj);
        res.status(200).json({
            message:"count successfully updated",
            new_count:new_count_obj,
            });
        }
        else {
        res.status(400).json("Either no UID or no user_data");
        }
    }
    catch(e){
        res.send(500).end("Error in count updating:"+e);
    }
})
app.post('/api/checkout', validateFirebaseIdToken, async (req, res) => {
    try{
        var website = req.body.url;
        console.log(website)
        if(uid){
            const session = await stripe.checkout.sessions.create({
            line_items: [{
                price: 'price_1PeHngFhLkLgimBLjYeKe1Ws', // Replace with your price ID
                quantity: 1,
            },],
            mode: 'subscription',
            success_url: website + '/goals',
            cancel_url: website + '/membership',
            });
            res.json({ url: session.url }).end();
        }
        else {
        res.status(200).send("No UID");
        }
    }
    catch(e:any){
      console.error("Error in checkout post:"+ e.message)
      res.status(500).send("Internal Server Error");
    }
});
async function user_payment (that_status:boolean,that_customer_id:string|null, that_subscription_id:string|null) {
    await db.ref(`Users/${uid}/payment`).update({
        payment_status: that_status,
        customer_id: that_customer_id,
        subscription_id: that_subscription_id
    })
}
  
app.post('/api/cancel', validateFirebaseIdToken, async (req, res) => {
    try {
    var user_pay:any = await db.ref(`users/${uid}/payment`).get();
        if (user_pay.payment_status && user_pay.subscription_id) {
        await stripe.subscriptions.cancel(user_pay.subscription_id);
        await user_payment(false,null,null)
        // res.json({status:"subscription_canceled"})
        res.status(200).send("subscription canceld successfully").end();
        }
        else {
        res.status(200).send("No Subscription").end();
        }
    }
    catch(e) {
        res.status(500).send(e).end()
        console.log("Error:",e)
    }
})
app.post("/api/points", validateFirebaseIdToken, async (req, res) => {
    try {
        console.log("Points")
        console.log(req.body.newPoints)
        if (uid && req.body.newPoints) {
        await db.ref(`Users/${uid}`).update({
            Points: req.body.newPoints,
        });
        console.log("updated")
        res.status(200).json({ message: "Update successful", status: true });
        } else {
        res.status(400).json({ message: "Invalid request data", status: false });
        }
    } catch (err:any) {
        res.status(500).json({ message: "Internal Server Error", error: err.message });
    }
});  
  
app.post('/webhook',/* bodyParser.raw({type: 'application/json'}) ,*/ async (req:Request, res:Response) => {
    const sig = req.headers['stripe-signature'];
    let event;
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET?.toString();

    try {
        if(sig && endpointSecret) {
            event = stripe.webhooks.constructEvent(req.body, sig,endpointSecret)
        }
        else{
            res.status(400).send("Either no stripe signature or no webhook endpoint defined");
        }
    }
    catch (err:any) {
        res.status(400).send(`Webhook Error: ${err.message}`);
    }
    event = req.body;
    try{
        switch (event.type) {
            case("checkout.session.completed"): {
                const {customer,subscription} = event.data.object;
                await user_payment(true, customer, subscription);
                break
            }
            case('invoice.payment_failed'):{
                await user_payment(false,null,null);
                console.log("No Payment")
                break
            }
        }
        // console.log('Received Stripe webhook:', event.type);
        res.status(200).end();
    }catch(e){
        console.log("Error in Webhook:",e)
    }
});
app.use(express.static(path.join(__dirname, 'frontend/browser')));

// Catch-all route to serve the main HTML file
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/browser/index.html'));
});
app.listen(port, () => {
    console.log(`Express server listening at http://localhost:${port}`);
});