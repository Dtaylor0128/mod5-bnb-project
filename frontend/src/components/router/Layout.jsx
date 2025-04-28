import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import { ModalProvider, Modal } from "../context/Modal";
//import { thunkAuthenticate } from