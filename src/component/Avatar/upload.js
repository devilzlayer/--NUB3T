import React   from "react";
import ReactCrop from "react-image-crop";


class Upload extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
          image: null,
          crop: {
            width: 90,
            aspect: 1 / 1,
            unit: "%",
            x: 0,
            y: 0,
          },
          croppedImageUrl: null,
        };
        this.inputFile = React.createRef();
    }

    onImageLoaded =  async (image) => {
        this.imageRef = image;
    };

    onCropComplete = async (crop) => {
        const { crop : { x , y} } = this.state

        if (this.imageRef && crop.width && crop.height) {
          const croppedImageUrl = await this.onGetCropImg(
            this.imageRef,
            crop, "newFile.jpeg"
          );
          this.setState({ croppedImageUrl });
        }
    };

    onGetCropImg = (image, crop, fileName) => {
        const canvas = document.createElement("canvas");
        const scaleX = image.naturalWidth / image.width;
        const scaleY = image.naturalHeight / image.height;
        canvas.width = 350;
        canvas.height = 350;
        const ctx = canvas.getContext("2d");
    
        ctx.drawImage(
          image,
          crop.x * scaleX,
          crop.y * scaleY,
          crop.width * scaleX,
          crop.height * scaleY,
          0,
          0,
          350,
          350
        );
        return new Promise((resolve, reject) => {
          canvas.toBlob((blob) => {
            if (!blob) {
              // reject(new Error('Canvas is empty'));
              console.error("Canvas is empty");
              return;
            }
            blob.name = fileName;
            window.URL.revokeObjectURL(this.fileUrl);
            this.fileUrl = window.URL.createObjectURL(blob);
            // console.warn("he", blob.size);
            // resolve(this.fileUrl);
            resolve(blob);
            // resolve(canvas.toDataURL('image/jpeg'));
          }, "image/jpeg");
        });
    };


    onCropChange = (crop, percentCrop) => {
        this.setState({ crop });
    };

  
    
    render(){
        const { src , onHide , onSendBack } = this.props
        const { crop , croppedImageUrl } = this.state
        if(src){
            return  <div className="modal-custom-wrap">
                        <div className="modal-custom-content">
                        <div className="modal-custom-image">
                            <ReactCrop
                            src={src}
                            crop={crop}
                            onImageLoaded={this.onImageLoaded}
                            onComplete={this.onCropComplete}
                            onChange={this.onCropChange}
                            />
                        </div>
                        <div className="modal-custom-buttons">
                            <button onClick={onHide}>取消</button>
                            <button className={"active"} onClick={() => onSendBack(croppedImageUrl)}>
                                保存
                            </button>
                        </div>
                        </div>
                    </div>
        }
        return null
    }
}
export default Upload