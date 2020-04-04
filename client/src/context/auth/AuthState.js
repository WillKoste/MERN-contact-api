import React, {useReducer} from 'react';
import axios from 'axios';
import setAuthToken from '../../utils/setAuthToken';
import AuthContext from './authContext';
import authReducer from './authReducer';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  CLEAR_ERRORS
} from '../types';

const AuthState = props => {
  const initialState = {
    token: localStorage.getItem('token'),
    isAuthenticated: null,
    user: null,
    loading: true,
    error: null
  }

  const [state, dispatch] = useReducer(authReducer, initialState);

  const loadUser = async () => {
    if(localStorage.token){
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');
      const data = res.data;

      dispatch({
        type: USER_LOADED,
        payload: data
      });
    } catch (err) {
      dispatch({
        type: AUTH_ERROR
      });
    }
  }

  const register = async formData => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }

    try {
      const res = await axios.post('/api/users', formData, config);
      const data = res.data;

      dispatch({
        type: REGISTER_SUCCESS,
        payload: data
      });

      loadUser();
    } catch (err) {
      dispatch({
        type: REGISTER_FAIL,
        payload: err.response.data.msg
      });
    }
  }

  const clearErrors = () => {
    dispatch({
      type: CLEAR_ERRORS
    });
  }

  return (
    <AuthContext.Provider value={{
      token: state.token,
      isAuthenticated: state.isAuthenticated,
      loading: state.loading,
      user: state.user,
      error: state.error,
      register,
      clearErrors,
      loadUser
    }} >
      {props.children}
    </AuthContext.Provider>
  )
}

export default AuthState;