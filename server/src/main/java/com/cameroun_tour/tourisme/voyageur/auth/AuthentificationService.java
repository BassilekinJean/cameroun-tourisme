package com.cameroun_tour.tourisme.voyageur.auth;

public interface AuthentificationService {

    void inscriptionVoyageur();

    void inscriptionEstablishment();

    void googleAuthentification();

    void classiqueAuthentification();

    void loginOut();

    void refreshLogin();
}
