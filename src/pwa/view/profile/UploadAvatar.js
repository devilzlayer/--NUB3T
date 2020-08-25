import React from "react";
import ReactCrop from "react-image-crop";
class CropDemo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      image: null,
      crop: {
        width: 90,
        aspect: 1 / 1,
        unit: "%",
      },
      croppedImageUrl: null,
    };
    this.inputFile = React.createRef();
  }

  componentWillReceiveProps = (nextProps) => {
    const { src } = nextProps;
    if (!src) {
      this.setState({
        croppedImageUrl: null,
      });
    }
  };

  onImageLoaded = (image) => {
    this.imageRef = image;
  };

  onCropComplete = async (crop) => {
    if (this.imageRef && crop.width && crop.height) {
      const croppedImageUrl = await this.onGetCropImg(
        this.imageRef,
        crop,
        "newFile.jpeg"
      );
      this.setState({ croppedImageUrl });
      // console.log(croppedImageUrl)
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
        console.warn("he", blob.size);
        // resolve(this.fileUrl);
        resolve(blob);
        // resolve(canvas.toDataURL('image/jpeg'));
        // console.log(canvas.toDataURL('image/jpeg'))
      }, "image/jpeg");
    });
  };

  onCropChange = (crop, percentCrop) => {
    this.setState({ crop });
  };

  onSelectFile = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        this.setState({ image: reader.result });
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  ScanNow = () => {
    this.inputFile.click();
  };

  CropNow = () => {
    this.props.onCrop(this.state.croppedImageUrl);
  };

  onSendBack = () => {
    const { updateCustomPhoto } = this.props;
    const { croppedImageUrl } = this.state;
    if (croppedImageUrl) {
      updateCustomPhoto(croppedImageUrl, "custom");
    }
  };

  render() {
    const { onClose, src } = this.props;
    const { crop } = this.state;
    return (
      <div className="modal-custom-wrap">
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
            <button onClick={onClose}>取消</button>
            <button className={"active"} onClick={() => this.onSendBack()}>
              保存
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default CropDemo;
