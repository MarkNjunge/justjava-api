import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "./entities/User.entity";
import { Repository } from "typeorm";
import { UserDto } from "./dto/User.dto";
import { SaveAddressDto } from "./dto/SaveAddress.dto";
import { SessionDto } from "../../client/auth/dto/Session.dto";
import { AddressEntity } from "./entities/Address.entity";
import { AddressDto } from "./dto/Address.dto";
import { UpdateUserDto } from "./dto/UpdateUser.dto";
import { UpdateFcmTokenDto } from "./dto/UpdateFcmToken.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
    @InjectRepository(AddressEntity)
    private readonly addressesRepository: Repository<AddressEntity>,
  ) {}

  async getAllUsers(): Promise<UserDto[]> {
    return this.usersRepository.find();
  }

  async getUserById(id: number): Promise<UserDto> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException({ message: "User not found", meta: { id } });
    } else {
      return user;
    }
  }

  async updateUser(session: SessionDto, dto: UpdateUserDto) {
    return this.usersRepository.update({ id: session.userId }, dto);
  }

  async updateFcmToken(session: SessionDto, dto: UpdateFcmTokenDto) {
    return this.usersRepository.update(
      { id: session.userId },
      { fcmToken: dto.fcmToken },
    );
  }

  async deleteUser(session: SessionDto) {
    await this.usersRepository.delete({ id: session.userId });
  }

  async saveAddress(
    dto: SaveAddressDto,
    session: SessionDto,
  ): Promise<AddressDto> {
    const address = new AddressEntity();
    address.streetAddress = dto.streetAddress;
    address.deliveryInstructions = dto.deliveryInstructions;
    address.latLng = dto.latLng;
    address.user = (await this.getUserById(session.userId)) as UserEntity;

    const saved = await this.addressesRepository.save(address);
    delete saved.user; // Remove unnecessary user object from response

    return saved;
  }

  async updateAddress(id: number, dto: SaveAddressDto, session: SessionDto) {
    // Ensure that the address being updated exists and belongs to the user
    const address = await this.addressesRepository
      .createQueryBuilder("address")
      .leftJoinAndSelect("address.user", "user")
      .where("address.id = :addressId", { addressId: id })
      .andWhere("user.id = :userId", { userId: session.userId })
      .getOne();

    if (!address) {
      throw new NotFoundException({
        message: "Address not found",
        meta: {
          reason:
            "Either the address does not exist, or exists but does not belong to the user",
        },
      });
    }

    await this.addressesRepository.update({ id }, dto);
  }

  async deleteAddress(id: number, session: SessionDto) {
    const address = await this.addressesRepository
      .createQueryBuilder("address")
      .leftJoinAndSelect("address.user", "user")
      .where("address.id = :addressId", { addressId: id })
      .andWhere("user.id = :userId", { userId: session.userId })
      .getOne();

    if (address) {
      await this.addressesRepository.delete({ id: address.id });
    }
  }
}
