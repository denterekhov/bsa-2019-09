import React from 'react';
import PropTypes from 'prop-types';
import validator from 'validator';
import { Modal, Input, Icon } from 'semantic-ui-react';

import styles from './styles.module.scss';

class SharedPostLink extends React.Component {
    state = {
        copied: false,
        emailInput: ''
    };

    copyToClipboard = (e) => {
        this.input.select();
        document.execCommand('copy');
        e.target.focus();
        this.setState({ copied: true });
    };

    sharePost = () => {
        const { userName, email } = this.props;
        const { emailInput } = this.state;
        if (validator.isEmail(emailInput)) {
            this.props.sharePost({
                to: emailInput,
                from: email,
                subject: `User ${userName} shared a post with you`,
                text: `User ${userName} shared a post with you. If want to read it, please follow this link ${this.input.props.value}`
            });
            this.setState({
                emailInput: 'Post was successfully shared!'
            });
        } else {
            this.setState({
                emailInput: 'Please, enter valid email'
            });
        }
    };

    render() {
        const { postId, close } = this.props;
        const { copied, emailInput } = this.state;
        return (
            <Modal open onClose={close}>
                <Modal.Header className={styles.header}>
                    <span>Share Post</span>
                    {copied && (
                        <span>
                            <Icon color="green" name="copy" />
                            Copied
                        </span>
                    )}
                </Modal.Header>
                <Modal.Content>
                    <Input
                        fluid
                        action={{ color: 'teal', labelPosition: 'right', icon: 'copy', content: 'Copy', onClick: this.copyToClipboard }}
                        value={`${window.location.origin}/share/${postId}`}
                        ref={(input) => { this.input = input; }}
                    />
                    <Input
                        fluid
                        action={{ color: 'olive', labelPosition: 'right', icon: 'share', content: 'Share', onClick: this.sharePost }}
                        placeholder="Enter email to share this post"
                        onChange={e => this.setState({ emailInput: e.target.value })}
                        value={emailInput}
                    />
                </Modal.Content>
            </Modal>
        );
    }
}

SharedPostLink.propTypes = {
    postId: PropTypes.string.isRequired,
    close: PropTypes.func.isRequired,
    sharePost: PropTypes.func.isRequired,
    userName: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired
};

export default SharedPostLink;
