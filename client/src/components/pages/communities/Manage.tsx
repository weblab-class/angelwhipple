import React, { useState, useEffect } from "react";
import { socket } from "../../../client-socket";
import { get, post } from "../../../utilities";
import { RouteComponentProps, useNavigate } from "@reach/router";
import Community from "../../../../../shared/Community";

type Props = RouteComponentProps & {
  activeCommunity: Community;
};

// TODO

const ManageCommunity = (props: Props) => {
  return <div className="centered default-container">Admin community management coming soon</div>;
};

export default ManageCommunity;
