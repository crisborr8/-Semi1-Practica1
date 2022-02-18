import React from 'react';
import 'react-dropzone-uploader/dist/styles.css'
import Dropzone from 'react-dropzone-uploader'
import { getDroppedOrSelectedFiles } from 'html5-file-selector';

const FileUploadComponent = ({params}) => {
    const fileParams = ({ meta }) => {
        return { url: 'https://httpbin.org/post' }
    }
    const onFileChange = ({ meta, file }, status) => { 
        console.log(status, meta, file) 
    }
    const onSubmit = (files, allFiles) => {
        allFiles.forEach(f => f.remove())
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
            onSubmit={onSubmit}
            onChangeStatus={onFileChange}
            InputComponent={selectFileInput}
            getUploadParams={fileParams}
            getFilesFromEvent={getFilesFromEvent}
            accept="image/*,audio/*,video/*"
            maxFiles={params.cantidad}
            inputContent="Colocalo aquí"
            styles={{
                dropzone: { width: '90%', height: '50%' },
            }}            
        />
    );
};
export default FileUploadComponent;