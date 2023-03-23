import { Loader } from '@/components/loader/loader';
import * as React from 'react';
import { Component } from 'react';

export class UploaderMulti extends Component<any, {}> {

    public imageInputRef$: any;

    public state: any = {
        attachments: [],
        uploadQuantity: 0,
        loading: false,
        error: null
    };

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevState.attachments !== this.state.attachments && this.state.attachments.length === this.state.uploadQuantity) {
            if (this.props.onUploadSuccess) {
                this.props.onUploadSuccess(this.state.attachments);
            }
        }
        if (prevState.loading !== this.state.loading) {
            console.log('triggering ', this.state.loading);
        }
    }

    public render(): React.ReactNode {
        return <div className={'ProfileImageUploader'}>
            <label htmlFor={'profileImageUpload'}>
                <div className={'image-upload hover-opacity position-center'}>
                    <Loader loading={this.state.loading} children={<span>Upload</span>}/>
                </div>
            </label>
            <input
                onChange={(e) => this.addFiles(e)}
                ref={(ref) => this.imageInputRef$ = ref}
                accept="image/*"
                className={'display-none'}
                type={'file'}
                id={'profileImageUpload'}
                multiple={true}
            />
        </div>;
    }

    public async addFiles(e: any) {
        const files = e.target.files || [];
        this.setState({ uploadQuantity: files.length });
        console.log(files[0]);
        for (const file of files) {
            await this.addFile(file);
        }
    }

    public async addFile(file: any) {
        this.setState({ loading: true });
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            try {
                const newAttachment = {
                    base64: Buffer.from((reader.result as Buffer)).toString('base64'),
                    name: file?.name || '',
                    type: file?.type || 'image/png'
                };
                this.setState({
                    attachments: [...this.state.attachments, newAttachment],
                    error: null,
                });
            } catch (err) {
                this.setState({ error: err });
            } finally {
                this.setState({ loading: false });
            }
        };
    }
}
