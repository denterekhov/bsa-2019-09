import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Icon, Image, Segment } from 'semantic-ui-react';

import styles from './styles.module.scss';

const initialState = {
    body: '',
    imageId: undefined,
    imageLink: undefined
};

class AddPost extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initialState,
            isUploading: false
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.body === '' && props.editingPost) {
            return {
                body: props.editingPost.body,
                postId: props.editingPost.id,
            };
        }
        return null;
    }

    handleAddPost = async () => {
        const { imageId, body } = this.state;
        if (!body) {
            return;
        }
        await this.props.addPost({ imageId, body });
        this.setState(initialState);
    }

    cancelUpdatePostOnKeyDown = async (e) => {
        const { body, postId } = this.state;
        const escKey = e.key === 'Escape';
        if (escKey) {
            await this.props.updatePost(postId, { body });
            this.setState({
                ...initialState,
                postId: undefined
            });
        }
    }

    handleUpdatePost = async () => {
        const { body, postId } = this.state;
        if (!body) {
            return;
        }
        await this.props.updatePost(postId, { body });
        this.setState({
            ...initialState,
            postId: undefined
        });
    }

    handleUploadFile = async ({ target }) => {
        this.setState({ isUploading: true });
        try {
            const { id: imageId, link: imageLink } = await this.props.uploadImage(target.files[0]);
            this.setState({ imageId, imageLink, isUploading: false });
        } catch {
            // TODO: show error
            this.setState({ isUploading: false });
        }
    }

    render() {
        const { imageLink, body, isUploading, postId } = this.state;
        return (
            <Segment>
                <Form onSubmit={!postId ? this.handleAddPost : this.handleUpdatePost}>
                    <Form.TextArea
                        name="body"
                        value={body}
                        placeholder="What is the news?"
                        onChange={ev => this.setState({ body: ev.target.value })}
                        onKeyDown={this.cancelUpdatePostOnKeyDown}
                    />
                    {imageLink && (
                        <div className={styles.imageWrapper}>
                            <Image className={styles.image} src={imageLink} alt="post" />
                        </div>
                    )}
                    <Button color="teal" icon labelPosition="left" as="label" loading={isUploading} disabled={isUploading}>
                        <Icon name="image" />
                        Attach image
                        <input name="image" type="file" onChange={this.handleUploadFile} hidden />
                    </Button>
                    <Button floated="right" color="blue" type="submit">{postId ? 'Update' : 'Post'}</Button>
                </Form>
            </Segment>
        );
    }
}

AddPost.propTypes = {
    addPost: PropTypes.func.isRequired,
    uploadImage: PropTypes.func.isRequired,
    updatePost: PropTypes.func.isRequired,
    editingPost: PropTypes.objectOf(PropTypes.string),
};

AddPost.defaultProps = {
    editingPost: undefined
};

export default AddPost;
