import { useEffect } from "react";
import { OidcClient } from "oidc-client-ts";

function App() {
  useEffect(() => {
    const clientUrl = "https://jwt.io";
    const oidcClient = new OidcClient({
      authority: "http://localhost:3000/oidc",
      client_id: "foo",
      redirect_uri: clientUrl,
      post_logout_redirect_uri: clientUrl,
      response_type: "code",
      scope: "openid email roles",
      response_mode: "fragment",
      filterProtocolClaims: true,
    });

    oidcClient
      .createSigninRequest({
        state: { bar: 15 },
      })
      .then((req) => {
        console.log(req.url);
      });
  },[]);
  return <></>;
}

export default App;
