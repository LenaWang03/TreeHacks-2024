import "./DefaultPrompts.css";
import DefaultPrompt from "../../DefaultPrompt/DefaultPrompt";
import { FaFacebook } from "react-icons/fa";
import { FaMapMarkerAlt } from "react-icons/fa";
import { FaEnvelope } from "react-icons/fa";
import { FaAmazon } from "react-icons/fa";

export default function DefaultPrompts() {
  return (
    <div className="prompt-group">
      <DefaultPrompt 
        prompt="Facebook"
        description="show me images of my grandson"
        icon={<FaFacebook />}
      />
      <DefaultPrompt 
        prompt="Google Maps"
        description="give me the direction to my local community centre"
        icon={<FaMapMarkerAlt />}
      />
      <DefaultPrompt 
        prompt="Gmail"
        description="send a happy birthday email to my niece"
        icon={<FaEnvelope />}
      />
      <DefaultPrompt 
        prompt="Amazon"
        description="buy my daughter a Christmas present"
        icon={<FaAmazon />}
      />
    </div>
  );
}
