import axios from "axios";
export const login = async (username, password) => {
    try{
        const response = await axios.post(`http://localhost:8080/auth/login`,{}, {  
            auth: {
              username,
              password
            }
          })
          if (response.status === 200){
            return response.data
        } else {
            console.log(error)
        }
    } catch(err){
        console.log(err)
    }
  };