package com.cameroun_tour.tourisme.auth.api;

public interface AuthentificationService {

    void inscriptionVoyageur();

    void inscriptionEstablishment();

    void googleAuthentification();

    void classiqueAuthentification();

    void loginOut();

    void refreshLogin();
}
