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
    }

    public render(): React.ReactNode {
        return <div className={'ProfileImageUploader'}>
            <label htmlFor={'profileImageUpload'}>{this.props.trigger}</label>
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
        this.setState({ loading: true });
        this.setState({ uploadQuantity: files.length });

        for (const file of files) {
            await this.addFile(file);
        }

        this.setState({ loading: false });
    }

    public async addFile(file: any) {
        const reader = new FileReader();

        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            try {
                this.setState({ error: null });
                const upload: any = await this.createAttachment(Buffer.from((reader.result as Buffer)).toString('base64'));
                this.setState({ attachments: [...this.state.attachments, upload.default.payload || ''] });
            } catch (err) {
                this.setState({ error: err });
            }
        };
    }

    public async createAttachment(data: string) {
        console.log('sending attachment', data);
        return {};
    }
}
