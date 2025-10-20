package com.cameroun_tour.tourisme;

import org.junit.jupiter.api.Test;
import org.springframework.modulith.core.ApplicationModules;

public class ModularityTest {

    @Test
    void verifyModularity() {
        ApplicationModules modules = ApplicationModules.of(TourismeApplication.class);
        modules.verify();
    }
}
