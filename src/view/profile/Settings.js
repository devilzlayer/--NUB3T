import React, { useState, useEffect, useContext } from "react";
import moment from 'moment'
import { map , size , isNumber} from 'lodash'
import { User } from "../../service";

import Calendar from './settings/calendar'

const Settings = (props) =>{
    const { type , onHide } = props
    const { setUserAuthFN ,userAuth} = useContext(User.Context);
    const { data : {
        realName,
        phone_verify,
        telephone,
        birthday,
        email,
    } } =    userAuth

    const { password } = User.read()

    const [ newDate, setNewDate ]       = useState(null);
    const [ message, setMessage ]       = useState({});
    const [ code, setCode ]             = useState(false);
    const [ verified, setVerified ]     = useState(false);
    const [ active , setActive ]        = useState(false)
    const [ forms  , setForms  ]        = useState({
        realname     : realName     ? realName      : '',
        phone        : telephone    ? telephone     : '',
        birthday     : birthday     ? birthday      : '', 
        email        : email        ? email         : '', 
        code         : '',
    });

    const [ vision, setVision ]       = useState({
        password        : false,
        password_new    : false,
        password_newok  : false,
    });
    const [ formPW, setFormPW ] = useState({
        password        : "",
        password_new    : "",
        password_newok  : "",
    });

    useEffect(()=>{
        // console.log(type)
        setForms({
            realname     : realName     ? realName      : '',
            phone        : telephone    ? telephone     : '',
            birthday     : birthday     ? birthday      : '', 
            email        : email        ? email         : '', 
            code        
        })
        setActive(false)
        setVerified(false)
        
        
    },[type])
    

    useEffect(() =>{
        if(type === 'name'){
            if (forms.realname !== "" && size(forms.realname) > 1 && size(forms.realname) < 5)
            setActive(true);
            else setActive(false);
        }
    },[forms.realname])

    useEffect(() =>{
        if(type === 'email'){
            const validateEmail = (email) => {
                const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            }
            if (forms.email !== "" && validateEmail(forms.email)) 
                setActive(true);
            else 
                setActive(false);
                setVerified(false);
        }
    },[forms.email])

    useEffect(() =>{
        if(type === 'phone'){
            setCode(false);
            setActive(false);
            
            if (forms.phone !== "" && size(forms.phone ) === 11) {
                setCode(true);
            }

            if(forms.code !== ""){
                setActive(true);
            }
            
          
        }
    },[forms.phone , forms.code])

    
    useEffect(() =>{
        if(type === 'password'){
            if(formPW.password !== "" && formPW.password_new !== "" && formPW.password_newok !== "" ){
                setActive(true);
            }
            if(formPW.password !== password){
                setActive(false);
            }
            if(formPW.password_new !== formPW.password_newok  ){
                setActive(false);
            }
        }
    },[formPW])

    useEffect(() =>{
        if(type === 'birthday'){
            if (newDate !== "" )
            setActive(true);
            else setActive(false);
        }
    },[newDate])


    const onUpdate = () =>{
        // console.log(forms)
        if(active){
            User.update({
                ...User.read(),
                ...forms,
            }).promise.then((r) => {
                console.info("✅ You have successfully updated account",r.info);
                User.session({
                    ...User.read(),
                }).promise.then((r) => setUserAuthFN(1, r.info));
    
                setVerified(true)
                
            },(e) => {
                console.warn("Unable to update account:", e);
            });
        }
        
    }

    const onUpdatePW = () =>{
        // console.log(formsPw)
        if(active){
            console.log(formPW)

            User.updatePassword({
                ...User.read(),
                ...formPW,
            }).promise.then((r) => {
                console.info("✅ You have successfully updated password:",r.info);
                setMessage({
                    text  : r.info,
                    valid : true
                })

            },(e) => {
                console.info("Unable to update password:", e);
                setMessage({
                    text  : e,
                    valid : false
                })

            });
        }
    }   

    const onUpdateNo = () =>{
        if(active){
            const { phone , code  }  = forms
            User.update({
                ...forms,
                ...User.read(),
                phone,
                verification_code: code,
            }).promise.then((r) => {
                  console.info("✅ You have successfully updated account phone number:",r.info);
                  setVerified(true)
                  User.session({
                    ...User.read(),
                  }).promise.then((r) => setUserAuthFN(1, r.info));
                  

            },(e) => {
                  console.warn("Unable to update account phone number:", e);
            });
        }
    }

    const onVerifyCode = () =>{
        if(type === 'phone'){
            const { phone  }  = forms
            const req = User.mobileVerification({
                type: "verification_code",
                phone,
                ...User.read(),
            });
        
            req.promise.then((r) => {
                console.log("Verification sent!");
            },(e) => {
                console.warn("Verification nto generated", e);
            });
        }
    }

    const onUpdateDate = () =>{
        if(type === 'birthday'){
            User.update({
                ...User.read(),
                ...forms,
                birthday: newDate
            }).promise.then((r) => {
                console.info("✅ You have successfully updated account",r.info);
                User.session({
                    ...User.read(),
                }).promise.then((r) => setUserAuthFN(1, r.info));
    
                setVerified(true)
                
            },(e) => {
                console.warn("Unable to update account:", e);
            });
        }
    }

    const onChange = (event) =>{
        const { name , value } = event.target
        setForms( e =>({
            ...e,
            [name] : value
        }))
    }

    const onChangePW = (event) =>{
        const { name , value } = event.target
        setFormPW( e =>({
            ...e,
            [name] : value
        }))
    }

    // console.log(active)


    return  <div className={`pesonal-setting-desktop-wrap ${type ? 'show': ''}`}>
                <div className="pesonal-arrow" onClick={onHide}/>
                <div className="profile-section section-box">
                    <div className="personal-form-wrap">
                        {/* --------------------- NAME ----------------------- */}
                        {type === "name" && 
                        <div className="personal-form name">
                            <div className="personal-form-group">
                                <label>真实姓名</label>
                                <input value={forms.realname} type="text" name="realname" placeholder="用于提现时安全核对" onChange={onChange} maxLength={4} />
                            </div>
                            <div className={`personal-form-button ${active ? 'active' : ''}`}   onClick={onUpdate}  >提交</div>
                        </div> }
                        {/* --------------------- EMAIL ----------------------- */}
                        {type === "email" && 
                        <div className="personal-form email">
                            <div className={`personal-form-group ${verified ? 'verified' : ''}`}>
                                {verified && <i/>}
                                <label>邮箱地址</label>
                                <input value={forms.email} type="email" name="email" placeholder="请输入绑定的邮箱地址"  onChange={onChange}  />
                                
                            </div>
                            <div className={`personal-form-button ${active ? 'active' : ''}`}  onClick={onUpdate}  >提交</div>
                        </div>
                        }
                        {/* --------------------- PASSWORD ----------------------- */}
                        {type === "password" && 
                        <div className="personal-form password">
                            {message && <div className={`message ${message.valid ? 'valid': 'invalid'}`}>{message.text}</div>}
                            <div className="personal-form-group">
                                <label>原密码</label>
                                <input  type={vision.password ? 'text' : 'password'} name="password" placeholder="原密码" onChange={onChangePW}  />
                                <i className={`eye ${vision.password ? 'vision' : ''}`} onClick={() => setVision( f => ({ ...f , password : !vision.password }))} />
                            </div>
                            <div className="personal-form-group">
                                <label>新密码</label>
                                <input  type={vision.password_new ? 'text' : 'password'} name="password_new" placeholder="新密码" onChange={onChangePW}  />
                                <i className={`eye ${vision.password_new ? 'vision' : ''}`} onClick={() => setVision( f => ({ ...f , password_new : !vision.password_new }))}/>
                            </div>
                            <div className="personal-form-group">
                                <label>验证新密码</label>
                                <input type={vision.password_newok ? 'text' : 'password'} name="password_newok" placeholder="验证新密码" onChange={onChangePW}  />
                                <i className={`eye ${vision.password_newok ? 'vision' : ''}`} onClick={() => setVision( f => ({ ...f , password_newok : !vision.password_newok }))}/>
                            </div>
                            <div className={`personal-form-button ${active ? 'active' : ''}`} onClick={onUpdatePW}  >提交</div>
                        </div>
                        }
                        {/* --------------------- TELEPHONE ----------------------- */}
                        {type === "phone" && 
                        <div className="personal-form phone">
                            <div className={`personal-form-group ${verified ? 'verified' : ''}`}>
                                {verified && <i/>}
                                <label>手机号码</label>
                                <input value={forms.phone} type="number" name="phone" placeholder="请输入绑定的手机号码"  onChange={onChange} />
                            </div>
                            <div className="personal-form-group left">
                                <input type="number" name="code" placeholder="请输入验证码"  onChange={onChange} />
                                <div className={`verify-button ${code ? 'code' : ''}`} onClick={onVerifyCode}>发送验证码</div>
                            </div>
                            <div className={`personal-form-button ${active ? 'active' : ''}`}  onClick={onUpdateNo}  >提交</div>
                        </div>
                        }
                        {/* --------------------- BIRTHDAY ----------------------- */}
                        {type === "birthday" && 
                        <div className="personal-form birthday">
                            <div className={`personal-form-group ${verified ? 'verified' : ''}`}>
                                {verified && <i/>}
                                <Calendar onDate={(event) => setNewDate(event)} />
                            </div>
                            <div className={`personal-form-button ${active ? 'active' : ''}`}   onClick={onUpdateDate}  >提交</div>
                        </div> }

                    </div>
                </div>
            </div>

    
}

export default Settings