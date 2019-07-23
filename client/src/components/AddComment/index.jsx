import React from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';

class AddComment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            body: ''
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (state.body === '' && props.editingComment) {
            return {
                body: props.editingComment.body,
                commentId: props.editingComment.id,
            };
        }
        return null;
    }

    handleAddComment = async () => {
        const { body } = this.state;
        if (!body) {
            return;
        }
        const { postId } = this.props;
        await this.props.addComment({ postId, body });
        this.setState({ body: '' });
    }

    handleUpdateComment = async () => {
        const { body, commentId } = this.state;
        if (!body) {
            return;
        }
        await this.props.updateComment(commentId, { body });
        this.setState({
            body: '',
            commentId: undefined
        });
    }

    render() {
        const { body, commentId } = this.state;
        return (
            <Form reply onSubmit={!commentId ? this.handleAddComment : this.handleUpdateComment}>
                <Form.TextArea
                    value={body}
                    placeholder="Type a comment..."
                    onChange={ev => this.setState({ body: ev.target.value })}
                />
                <Button type="submit" content={commentId ? 'Update comment' : 'Post comment'} labelPosition="left" icon="edit" primary />
            </Form>
        );
    }
}

AddComment.propTypes = {
    addComment: PropTypes.func.isRequired,
    postId: PropTypes.string.isRequired,
    updateComment: PropTypes.func.isRequired
};

export default AddComment;
