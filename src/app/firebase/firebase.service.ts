import { Injectable } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, sendEmailVerification ,signInWithEmailAndPassword, updatePassword, updateEmail } from '@angular/fire/auth';
import { Database, ref, update, get } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class FirebaseService {
  constructor(private auth:Auth, private db:Database) { 
  }
  Authentication = this.auth;
  async store_all_data(child:object, path?:string) {
    const user = this.auth.currentUser;    
    if (!user) {
      alert("No user");
      return;
    }
    if (path) {
      const uid = user.uid;
      await update(ref(this.db, `/Users/${uid}/${path}`), child);
    } else{
      const uid = user.uid;
      await update(ref(this.db, `/Users/${uid}`), child);
    }   
  }
  async remove_data(data:string, path:string) {
    const user = this.auth.currentUser;
    if (user) {
      try {
        const uid = user.uid;
        const dataToRemove = {
          [data]:null,
        };
        await update(ref(this.db, `/Users/${uid}/${path}`), dataToRemove);
      }
      catch (e) {
        console.log("Error remove:",e);
      }
    }
    else{
      console.log("No user --> Does not remove Data")
    }   
  }

  async register(User_name:string, User_email:string, User_password:string) {
    return new Promise (async (res,rej) => {
      try {
        var new_user;
        await createUserWithEmailAndPassword(this.auth, User_email, User_password).then(async user_cred => {
          new_user= user_cred.user; 
          var userData = {
            Name: User_name,
            Email: User_email,
            Points: 0,
            profile_pic:0,
            count: {
              day:0,
              change:true,
              number:0,
            },
            payment: {
              customer_id:new Date(),
              payment_status:true,
              subscription_id:new Date(),
            }
            // change when you want users to pay --> remove payment  
          };
          await this.store_all_data(userData);
          res(new_user)
        })    
      } 
      catch (error:any) {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage)
        console.log(errorCode);
        rej(errorMessage);
      }
    })
    
  }
  login(email:string,password:string):Promise<any>{
    return new Promise(async (res, rej) => {
      await signInWithEmailAndPassword(this.auth,email,password)
      .then((userCredential) => {
          const user=userCredential.user;
          res(user);
      })
      .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          alert(errorMessage);
          rej(errorMessage)
          console.log(errorCode)
      });
    })
  }
  async logout() {
      await this.auth.signOut()
  }
  async change_password(newPassword:string, email:string, oldpassword:string) {
    const user = await this.auth.currentUser; 
    if(user) {
      await this.login(email, oldpassword).then(async callback => {
        if(callback){
          await updatePassword(user, newPassword).then(message => {
            alert(message); 
          }).catch(err => alert("Error with new Password: "+err));
        }
      }).catch(err => alert("Error with Old Password: "+err));
    }
    else alert("No user");
  }
  async change_email(newEmail:string) {
    const user = await this.auth.currentUser; 
    if(user) {await updateEmail(user,newEmail)}
    else alert("No user");
  }
  async getUserData(path?: string): Promise<any> {
    const user = await this.auth.currentUser; 
    if (!user) {
      throw new Error("User not logged in");
    }
    if(path){
      if (path === "uid") {
        return user.uid;
      } else {
        const uid = user.uid;
        const databaseRef = await ref(this.db, `/Users/${uid}/${path}`);
        const snapshot = await get(databaseRef);
        if (snapshot.exists()) {
          return snapshot.val()

        } else {
          return null;
        }
      }
    }
    else {
      const uid = user.uid;
      const databaseRef = await ref(this.db, `/Users/${uid}`);
      const snapshot = await get(databaseRef);
      if (snapshot.exists()) {
        return snapshot.val()
      } else {
        return null;
      }
    }
  }

 
  getUser(): Observable<any> {
    return new Observable<any>((subscriber) => {
      try {
        this.auth.onAuthStateChanged(
          async (user) => {
            if (user) {
              subscriber.next(user);
            } else {
              var new_user = await this.auth.currentUser;
              if(new_user){ subscriber.next(new_user)}
              else{
                subscriber.next(null);
                subscriber.error(new Error('User not logged in'));  // Added error handling for not logged-in user
              }
            }
          },
          (error) => {subscriber.error(error),              
            console.log(error)
          },
          () => subscriber.complete()
        );
      }catch(e) {
        console.error("Error:", e)
      }
    });
  }
   
}