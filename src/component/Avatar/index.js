import React , { useState , useEffect , useContext}  from "react";
import ReactCrop from "react-image-crop";
import { map} from 'lodash'
import { avatarClass } from './options'
import Upload from './upload'
import { User , Transaction} from "../../service";
import { getAuthKey } from '../../util';

// CSS NAV
const Avatar = (props) =>{   
    const { show , onHide , Refresh } = props
    const { setUserAuthFN ,userAuth } = useContext(User.Context);

    const userData = User.read();

    const [ activeImg , setActiveImg ] = useState(null)
    const [ imageSource, setImageSource] = useState(null);

    useEffect(()=>{
        window.addEventListener("keydown", (event) =>{
            if(event.keyCode === 27) {
                setImageSource(null)
                onHide()
            }
        });
    },[])

    const onUpload = (obj , custom) => {

        const data = new FormData();
        data.append("file", obj, "sam.jpg");
        data.append("username", userData.username);
        data.append("account", userData.account);
        data.append("password", userData.password);
        data.append("auth", getAuthKey());
        data.append("type", "upload_pictures");
        const res = Transaction.read({
            body: data,
            type: "upload_pictures",
        });

        res.promise.then((r) => {
            console.log("Upload sucessful", r);
            Refresh()
            if(custom){
                setImageSource(null)
            }
            
        },(e) => {
            console.log("Upload failed", e);
        });
    }

    const toDataURL = (url, callback) => {
        const xhr   = new XMLHttpRequest();
        xhr.onload  = function () {
            callback(xhr.response);
        };
        xhr.open("GET", url);
        xhr.responseType = "blob";
        xhr.send();
    }

    const onSetAvatar = (obj , i) =>{
        setActiveImg(i)
        toDataURL(obj , newUrl =>{
            onUpload(newUrl)
        })
    }


    const onSetCustomAvtr = (obj) =>{
        onUpload(obj , true)
    }

    const onSelectFile = e => {
        if (e.target.files && e.target.files.length > 0) {
            if (e.target.files[0] > 200000) {
                console.warn("File is too big!");
            } else {
                const fileReader = new FileReader();
                fileReader.onloadend = () => {
                  setImageSource(fileReader.result);
                };
                fileReader.readAsDataURL(e.target.files[0]);
            }
        }
    };

    if(show){
        return  <div className="nav-avatar-wrap-desktop" >
                    <div className="nav-avatar-content">
                    <div className="nav-avatar-item-wrap">
                        {
                            avatarClass && map(avatarClass , (obj,i) =>{
                                return  <div key={i} className="nav-avatar-items" style={{ backgroundImage: `url(${obj.url})`}} onClick={() => onSetAvatar(obj.url , i)}>
                                            <i className={`${activeImg === i ? 'show' : ''}`}/>
                                        </div>
                            })
                        }
                        <label  className="nav-avatar-items upload">
                            <input type="file"  onChange={onSelectFile}/>
                        </label>
                    </div>
                    </div>
                    <div className="nav-avatar-overlay" onClick={onHide} />
                    <Upload src={imageSource}  onHide={() => setImageSource(null)} onSendBack={onSetCustomAvtr}/>

                </div>
    }
    return null
    

}

export default Avatar