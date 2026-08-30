package com.cameroun_tour.tourisme.configuration;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
public class SpaRedirectController {

    // Redirige toutes les routes non trouvées (404) vers index.html pour laisser React Router gérer le routing
    // Exclut les fichiers avec extension (ex: .js, .css, .png) et les routes API (/api/**)
    @RequestMapping(value = {
        "/{path:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}",
        "/{path1:[^\\.]*}/{path2:[^\\.]*}/{path3:[^\\.]*}"
    })
    public String redirect() {
        return "forward:/index.html";
    }
}
