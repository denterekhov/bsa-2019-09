import React from 'react';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import * as imageService from 'src/services/imageService';
import { connect } from 'react-redux';
import { getUserImgLink } from 'src/helpers/imageHelper';
import {
    Grid,
    Image,
    Input,
    Icon,
    Button
} from 'semantic-ui-react';
import { setUserProps } from './actions';


class Profile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isUserStatusEditing: false,
            statusValue: '',
            isUsernameEditing: false,
            usernameValue: '',
            isImageAdding: false,
            isImageUploading: false,
            imageId: undefined,
            imageLink: undefined
        };
    }

    sendUserStatus = async () => {
        const { statusValue } = this.state;
        const { user } = this.props;
        await this.props.setUserProps({ status: statusValue, id: user.id });
        this.setState({ isUserStatusEditing: false });
    };

    sendUsername = async () => {
        const { usernameValue } = this.state;
        const { user } = this.props;
        await this.props.setUserProps({ username: usernameValue, id: user.id });
        this.setState({ isUsernameEditing: false });
    };

    sendUserImage = async () => {
        const { imageId } = this.state;
        const { user } = this.props;
        await this.props.setUserProps({ imageId, id: user.id });
        this.setState({ isImageAdding: false, imageLink: undefined });
    };

    handleUploadFile = async ({ target }) => {
        this.setState({ isImageUploading: true });
        try {
            const {
                id: imageId, link: imageLink
            } = await imageService.uploadImage(target.files[0]);
            this.setState({ imageId, imageLink, isImageUploading: false });
        } catch {
            this.setState({ isImageUploading: false });
        }
    }

    render() {
        const {
            isUsernameEditing,
            isUserStatusEditing,
            isImageAdding,
            isImageUploading,
            usernameValue,
            statusValue,
            imageLink
        } = this.state;
        const { user } = this.props;
        return (
            <Grid container textAlign="center" style={{ paddingTop: 30 }}>
                <Grid.Column>
                    <Image centered src={getUserImgLink(user.image)} size="medium" circular onClick={() => this.setState({ isImageAdding: true })} />
                    {isImageAdding && !imageLink && (
                        <>
                            <br />
                            <Button color="teal" icon labelPosition="left" as="label" loading={isImageUploading} disabled={isImageUploading}>
                                <Icon name="image" />
                                Upload avatar
                                {!imageLink && <input name="image" type="file" onChange={this.handleUploadFile} hidden />}
                            </Button>
                        </>
                    )}
                    {isImageAdding && imageLink && (
                        <>
                            <br />
                            <Button color="teal" icon labelPosition="left" as="label" loading={isImageUploading} disabled={isImageUploading} onClick={this.sendUserImage}>
                                <Icon name="image" />
                                Save avatar
                            </Button>
                        </>
                    )}
                    <br />
                    <Input
                        icon="user"
                        iconPosition="left"
                        placeholder="Username"
                        type="text"
                        disabled
                        value={user.username}
                    />
                    <Icon link name={!isUsernameEditing ? 'edit outline' : 'save'} onClick={!isUsernameEditing ? () => this.setState({ isUsernameEditing: true }) : this.sendUsername} />
                    {isUsernameEditing && (
                        <>
                            <br />
                            <Input
                                style={{ width: 224 }}
                                placeholder="Enter your name"
                                type="text"
                                value={usernameValue}
                                onChange={e => this.setState({ usernameValue: e.target.value })}
                            />
                        </>
                    )}
                    <br />
                    <br />
                    <Input
                        icon="at"
                        iconPosition="left"
                        placeholder="Email"
                        type="email"
                        disabled
                        value={user.email}
                    />
                    <br />
                    <br />
                    <Input
                        icon="star"
                        iconPosition="left"
                        placeholder="Set your status here"
                        type="text"
                        disabled
                        value={user.status}
                    />
                    <Icon link name={!isUserStatusEditing ? 'edit outline' : 'save'} onClick={!isUserStatusEditing ? () => this.setState({ isUserStatusEditing: true }) : this.sendUserStatus} />
                    {isUserStatusEditing && (
                        <>
                            <br />
                            <Input
                                style={{ width: 224 }}
                                placeholder="Set your status here"
                                type="text"
                                value={statusValue}
                                onChange={e => this.setState({ statusValue: e.target.value })}
                            />
                        </>
                    )}
                </Grid.Column>
            </Grid>
        );
    }
}

Profile.propTypes = {
    user: PropTypes.objectOf(PropTypes.any),
    setUserProps: PropTypes.func.isRequired
};

Profile.defaultProps = {
    user: {}
};

const mapStateToProps = rootState => ({
    user: rootState.profile.user
});

const actions = {
    setUserProps
};

const mapDispatchToProps = dispatch => bindActionCreators(actions, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
