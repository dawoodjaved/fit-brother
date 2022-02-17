import {firebase} from '../../firebase/config';
require('firebase/auth');
const signOut = () => {
    return (dispatch) =>{        
        firebase.auth().signOut().then(()=>{            
            dispatch({ type:'LOGOUT_SUCCESS' });
        });
    }
};
export default signOut;