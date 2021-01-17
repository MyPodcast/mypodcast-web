import React, { Component } from "react";
import "./scss/policy.sass";

export default class Policy extends Component {
  constructor(props) {
    super(props);
    document.title = "MyPodcast — Policy";
  }

  render() {
    return (
      <div className="content">
        <div className="legal">
          <h2 className="legal__title">
            Protection et traitement des données personnelles
          </h2>
          <h3 className="legal__subtitle">Conformité aux lois applicables</h3>
          <p className="legal__paragraph">
            Le site{" "}
            <a href="https://mypodcast.vercel.app/">
              https://mypodcast.vercel.app/
            </a>{" "}
            respecte la vie privée de ses utilisateurs et respecte strictement
            les lois en vigueur sur la protection de la vie privée et des
            libertés individuelles. Aucune information personnelle n'est
            collectée à votre insu. Aucune information personnelle n'est
            divulguée à des tiers.
          </p>
          <h3 class="legal__subtitle">Cookies</h3>
          <p className="legal__paragraph">
            Lors de la consultation de{" "}
            <a href="https://mypodcast.vercel.app/">
              https://mypodcast.vercel.app/
            </a>
            , des cookies sont placés sur votre ordinateur, mobile ou tablette.
            Seuls les cookies destinés à la mesure d'audience sont utilisés. Ces
            cookies ne collectent pas de données personnelles. Des outils de
            mesure d'audience sont déployés pour obtenir des informations sur la
            navigation des visiteurs. Ils permettent notamment de comprendre
            comment les utilisateurs arrivent sur un site et de reconstituer
            leur parcours.
          </p>
          <p className="legal__paragraph">
            Les données générées par les cookies sont transmises et stockées par
            des fournisseurs de mesure d'audience (Google Analytics). Les
            fournisseurs de mesure d'audience peuvent communiquer ces données à
            des tiers en cas d'obligation légale ou lorsque ces tiers traitent
            ces données en leur nom.
          </p>
          <p className="legal__paragraph">
            En savoir plus sur les cookies sur{" "}
            <a href="https://www.cookiesandyou.com">
              https://www.cookiesandyou.com
            </a>
            .
          </p>
        </div>
      </div>
    );
  }
}
