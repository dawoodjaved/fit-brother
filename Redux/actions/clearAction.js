const clearAction = () => {    
    return (dispatch) =>{
        dispatch({ type:'CLEAR_DATA'});
    }
}

export default clearAction;