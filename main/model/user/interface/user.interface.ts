import {LocationInterface} from "./location.interface";

interface UserInterface {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    username: string
    password: string
    location: LocationInterface
    active: boolean
    created: Date
    updated: Date
}

export default UserInterface