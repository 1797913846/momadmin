import { createStore } from 'redux'

const defaultState = localStorage.getItem('username');
 
const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'username' :
      return  action.playLoad||state
    default :
      return state
  }
}
 
const store = createStore(reducer)
 
export default store