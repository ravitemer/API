let url = "https://graphql.us.fauna.com/graphql";
import {gql, GraphQLClient} from "graphql-request";

export class FaunaGQL {
	constructor({uri, secret}) {
		this.secret = secret;
		this.uri = uri || "https://graphql.fauna.com/graphql";
		this.client = new GraphQLClient(this.uri, {headers: {Authorization: `Bearer ${this.secret}`}});
	}
	//================================================================================
	async query(str, vars = {}) {
		try {
			let data = await this.client.request(
				gql`
					${str}
				`,
				vars
			);
			return data;
		} catch (err) {
			throw new Error(err);
		}
	}
	//================================================================================
	async signup({username, email, password}) {
		try {
			return await this.query(`
          mutation{
              signup(data : {username : "${username}", email : "${email}", password : "${password}"}){
                          username
                          email
                        }}`);
		} catch (err) {
			throw new Error(err);
		}
	}
	//================================================================================
	async signin({email, password}) {
		try {
			return await this.query(`
          mutation{
              signin(data : {email : "${email}", password : "${password}"}){
                          token
                          user {
                            username
                            email
                          }
                        }}`);
		} catch (err) {
			throw new Error(err);
		}
	}
	//================================================================================
	async signout({allTokens}) {
		try {
			return await this.query(`
          mutation{
              signout(data : {allTokens : ${allTokens}})}`);
		} catch (err) {
			throw new Error(err);
		}
	}
	//================================================================================
}
//================================================================================

//const client = new FaunaGQL(url, "fnAEQCMjvhAARiIjGlPbuVLZKEY9g4aVIOUbMHil")
