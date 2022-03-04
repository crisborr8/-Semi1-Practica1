import React from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector';
var getBase64 = file => {
    return new Promise(resolve => {
      let fileInfo;
      let baseURL = "";
      // Make new FileReader
      let reader = new FileReader();

      // Convert the file to base64 text
      reader.readAsDataURL(file);

      // on reader load somthing...
      reader.onload = () => {
        // Make a fileInfo Object
        baseURL = reader.result;
        resolve(baseURL);
      };
    });
  };
const FileUploadComponent = ({params}) => {
    
    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }
    const onFileChange = ({ meta, file }, status) => { 
        if (status == "done"){
            getBase64(file).then(result => {
                result = result.split(",")[1]
                file["base64"] = result;
            })
            .catch(err => {
                console.log(err);
            });
            params.reg_files = []
            console.log(file)
            params.reg_files.push(file)
        }
    }
    const onSubmit = (files, allFiles) => {
        
        console.log("*****");
        console.log("----");
        params.reg_files = [];
        files.forEach(f => {
            var file = f.file
            getBase64(file).then(result => {
                result = result.split(",")[1]
                file["base64"] = result;
                console.log("++++++++++++++++++++");
                console.log(result);
                console.log("++++++++++++++++++++");
                console.log("File Is", file);
            })
            .catch(err => {
                console.log(err);
            });
            params.reg_files.push(f)
        });
        /*allFiles.forEach(f => {
            f.remove()
        })*/
    }
    const getFilesFromEvent = e => {
        return new Promise(resolve => {
            getDroppedOrSelectedFiles(e).then(chosenFiles => {
                resolve(chosenFiles.map(f => f.fileObject))
            })
        })
    }
    const selectFileInput = ({ accept, onFiles, files, getFilesFromEvent }) => {
        const textMsg = files.length > 0 ? 'Seguir subiendo' : 'Subir imagen'
        return (
            <label className="btn btn-danger mt-4">
                {textMsg}
                <input
                    style={{ display: 'none' }}
                    type="file"
                    accept={accept}
                    multiple
                    onChange={e => {
                        getFilesFromEvent(e).then(chosenFiles => {
                            onFiles(chosenFiles)
                        })
                    }}
                />
            </label>
        )
    }
    return (
        <Dropzone
            onChangeStatus={onFileChange}
            InputComponent={selectFileInput}
            getUploadParams={fileParams}
            getFilesFromEvent={getFilesFromEvent}
            accept="image/*"
            maxFiles={params.cantidad}
            inputContent="Colocalo aquí"
            styles={{
                dropzone: { width: '90%', height: '50%' },
            }}            
        />
    );
};
export default FileUploadComponent;