import React , {useState , useEffect} from "react";
import "./Form.css";
import  {useDispatch} from 'react-redux'
import Loader from '../Loader/Loader'
import { addTodo, editTodo } from "../../store/actions/index.action";
const  initialData = {
  title:'',
  description:'',
  priority:'',
  dueDate:'',
  createdAt:'',
  currentState:''
}

const validateObj = {
  title :{
    required:true,
    minLength:10,
    maxLength:140
  },
  description:{
    required:true,
    minLength:10,
    maxLength:500
  },
  priority:{
    required:true
  },
  dueDate:{
    required: true
  },
  createdAt:{
    required:false
  },
  currentState:{
    required:false
  }
}

const validate = (event , validateObj) => {
  let error = {}
  if(validateObj.required){
    if(event.trim().length == 0){
      error.required = true
    }else {
      delete error.required;
    }
  }
  if(validateObj.minLength){
    if(event.trim().length < validateObj.minLength){
      error.minLength = true
    }else {
      delete error.minLength;

    }
  }
  if(validateObj.maxLength){
    if(event.trim().length > validateObj.maxLength){
      error.minLength = true
    }else {
      delete error.maxLength
    }
  }

  return error;
}
export default function Form(props) {
  const {data = {} , formMode} = props || {}
  const dispatch = useDispatch();

  const [state , setState] = useState({...initialData})
  const [errors , setErrors] = useState({})

  useEffect(() => {
      setState(data)
      if(formMode == 'edit'){
        for(const key in data){
          const error = validate(data[key], validateObj[key])
          setErrors(x => {
          return {
            ...x,
            [key]:error
          }
          })
        }
      }
    
      
     
  }, [data])

  const [loading , setLoading] = useState(false)
  const handleChange = (event) => {
      const {name , value} = event.target;
      // console.log(value)

      const error = validate(value, validateObj[name])
      setErrors(x => {
      return {
        ...x,
        [name]:error
      }
      })
      setState((state) => {
        return {
            ...state,
            [name]:value
        }
      })

  }

  const handleCancel = () => {
      setState({title:'',
      description:'',
      priority:'',
      dueDate:'',
      createdAt:'',
      currentState:''})
      setErrors({})
  }
 const checkValid = () => {
      if(Object.keys(errors).length == 0) return false;

      if((errors.title && Object.keys(errors.title).length > 0 )|| (errors.description && Object.keys(errors.description).length > 0) || (errors.priority && Object.keys(errors.priority).length > 0) || (errors.dueDate && Object.keys(errors.dueDate).length > 0)){
        return false
      }
      if(!errors.title ||  !errors.description || !errors.priority || !errors.dueDate){
        return false
      }

      return true
 }
 const handleSubmit = () => {

   if(formMode == 'add'){
    dispatch(addTodo({
      ...state,
      createdAt: new Date().toISOString(),
      currentState: 'open'
    })).then(() => {
      setLoading(false)
      props.closeModal()
    })
   } else if(formMode == 'edit'){
    dispatch(editTodo({
      ...state
    })).then(() => {
      setLoading(false)
      props.closeModal()
    })
   }
  
   setLoading(true)
   
     
 }
  return (
    <>
    {loading ? <div style={{width:'100%',height:'100%',position:'absolute'}}><Loader /> </div>: null}
    <form style={{ margin: "10px" }} noValidate>
      <div className="form-group-1">
        <div className="form-control-1">
          <label htmlFor="summary">Summary:</label>
          <input disabled={formMode == 'view'} minLength="10" maxLength="140" required value={state.title} onChange={handleChange} name="title" type="text" id="summary" />
  <span style={{color:'red'}}>{errors && errors.title ? (errors.title.required ? 'title field is required' :(errors.title.minLength || errors.title.maxLength ? 'title should be between 10 to 140 characters' : null)) : null}</span>
        </div>
        <div className="form-control-1">
          <label htmlFor="description">Description:</label>
          <textarea disabled={formMode == 'view'} minLength="10" maxLength="500" required value={state.description} onChange={handleChange} name="description" id="description" />
          <span style={{color:'red'}}>{errors && errors.description ? (errors.description.required ? 'description field is required' :(errors.description.minLength || errors.description.maxLength ? 'description should be between 10 to 140 characters' : null)) : null}</span>
        </div>
      </div>
      <div className="form-group-2">
        <div className="form-control-1">
          <label htmlFor="priority">Priority:</label>
          <select disabled={formMode == 'view'} required value={state.priority} name="priority" onChange={handleChange} id="priority">
            <option value="">None</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <span style={{color:'red'}}>{errors && errors.priority &&  errors.priority.required ? 'priority field is required' : null}</span>

        </div>
        <div className="form-control-1">
        <label htmlFor="duedate">Due Date:</label>
          <input disabled={formMode == 'view'} value={state.dueDate} onChange={handleChange} name="dueDate" type="datetime-local" id="duedate" />
        </div>
      </div>
      {props.formMode == 'view' && <div className="form-group-2">
        <div className="form-control-1">
          <label htmlFor="createddate">Created At:</label>
          <input value={state.createdAt} disabled  name="createdat" type="text" id="createddate" />

        </div>
        <div className="form-control-1">
        <label htmlFor="currentstate">Current State:</label>
          <input disabled value={state.currentState} name="currentstate" type="text" id="currentstate" />
        </div>
      </div>}
      {props.formMode != 'view' && <div className="form-buttons">
        <button type="button" className="btn" onClick={handleCancel}>
          Cancel
        </button>
        <button disabled={!checkValid()} type="button" className="btn btn-success" onClick={handleSubmit}>
          Save
        </button>
      </div>}
    </form></>
  );
}
