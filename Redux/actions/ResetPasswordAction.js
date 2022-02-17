import {firebase} from '../../firebase/config';
require('firebase/auth');

const ResetPasswordAction = (email) => {
    
    return (dispatch) =>{
        //do some async tasks then resume the dispatch.     
        firebase.auth().sendPasswordResetEmail(email).then(()=>{            
            dispatch({ type:'RESET_SUCCESS' });
        }).catch((error)=>{
            //error is assigned by ES6 refactoring.
            dispatch({ type:'RESET_ERROR',error });
        });
        
    }
};


export default ResetPasswordAction;