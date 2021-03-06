import firebaseConfig from "./config";
import axios from 'axios';

class Firebase {
  constructor(app) {
    if(!firebaseInstance) {
      app.initializeApp(firebaseConfig);

      this.auth = app.auth();
      this.db = app.firestore();
      this.functions = app.functions();
      this.storage = app.storage();
    }
  }

  async getGuestInfo({code}) {
    return await this.db.collection('guests').where('code', '==', code).get();
  }

  async sendInvitation(data) {
    const sendCodeEmailCallable = this.functions.httpsCallable('sendCodeViaEmail');
    const { first_name, last_name, code, plus_guests, email } = data;
    return sendCodeEmailCallable({
      first_name,
      last_name,
      code,
      plus_guests,
      email
    });
  }

  async sendTickets(data) {
    const sendTicketsEmailCallable = this.functions.httpsCallable('sendTicketsViaEmail');
    const { first_name, last_name, id, email } = data;
    return sendTicketsEmailCallable({
      first_name,
      last_name,
      id,
      email
    });
  }

  async login({email, password}) {
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  async logout() {
    await this.auth.signOut();
  }
}

let firebaseInstance;

function getFirebaseInstance(app) {
  if(!firebaseInstance && app){
    firebaseInstance = new Firebase(app);
    return firebaseInstance;
  }else if(firebaseInstance){
    return firebaseInstance
  }else{
    return null;
  }
}

export default getFirebaseInstance;
