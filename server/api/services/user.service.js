import cryptoHelper from '../../helpers/crypto.helper';
import userRepository from '../../data/repositories/user.repository';

export const getUserById = async (userId) => {
    const { id, username, email, imageId, image, status } = await userRepository.getUserById(userId);
    return { id, username, email, imageId, image, status };
};

export const getUserByEmail = async (email) => await userRepository.getByEmail(email);

export const setResetPasswordTokenAndDate = async(id, token, date) => await userRepository.setResetPasswordTokenAndDate(id, token, date);

export const getUserToResetPassword = async(token, date) => await userRepository.getUserToResetPassword(token, date);

export const setNewPassword = async(token, password) => await userRepository.setNewPassword({
    token, 
    password: await cryptoHelper.encrypt(password)
});

export const setUserProps = (request) => userRepository.updateUserPropById(request);
