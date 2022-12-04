const Session = require('../model/Session.js')

// Function to check if user session is active or not
async function isUserSessionActive({session_id}) {

    let userSession = await Session.findOne({session_id: session_id});

    if (!userSession) return false;

    return userSession.is_active;
}

module.exports = { isUserSessionActive };