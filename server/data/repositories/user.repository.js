import Sequelize from 'sequelize';

import { UserModel, ImageModel } from '../models/index';
import BaseRepository from './base.repository';

const Op = Sequelize.Op;

class UserRepository extends BaseRepository {
    addUser(user) {
        return this.create(user);
    }

    getByEmail(email) {
        return this.model.findOne({ where: { email } });
    }

    getByUsername(username) {
        return this.model.findOne({ where: { username } });
    }

    getUserById(id) {
        return this.model.findOne({
            group: [
                'user.id',
                'image.id'
            ],
            where: { id },
            include: {
                model: ImageModel,
                attributes: ['id', 'link']
            }
        });
    }
    
    async updateUserPropById({id, ...prop}) {
        const result = await this.model.update(
            prop, 
        { 
            where: { id },
            returning: true
        });

        return result[1];
    }

    async setResetPasswordTokenAndDate(id, token, date) {
        const result = await this.model.update({ 
            resetPasswordToken: token,
            resetPasswordExpires: date
        }, { 
            where: { id },
            returning: true
        });

        return result[1];
    }

    async getUserToResetPassword(token, date) {
        const result = await this.model.findOne({ 
            where: { 
                resetPasswordToken: token,
                resetPasswordExpires: { 
                    [Op.gte]: date 
                }
            },
            returning: true
        });

        return result;
    }

    async setNewPassword({token, password}) {
        const result = await this.model.update({ 
            password,
            resetPasswordToken: null,
            resetPasswordExpires: null
        }, {
            where: { 
                resetPasswordToken: token,
            },
            returning: true
        });

        return result[1];
    }
}

export default new UserRepository(UserModel);
