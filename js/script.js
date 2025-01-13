// Definiere die Fragen für jeden Aspekt
const aspects = {
    autonomie: [
        "Ich bevorzuge es, meine eigenen Entscheidungen ohne äußeren Einfluss zu treffen.",
        "Unabhängigkeit ist mir wichtiger als die Zugehörigkeit zu einer Gruppe.",
        "Ich fühle mich wohler, wenn ich meine Arbeitsmethoden selbst wählen kann.",
        "Es ist mir wichtig, meine persönlichen Ziele ohne Einschränkungen verfolgen zu können.",
        "Ich genieße es, selbstständig Probleme zu lösen, ohne auf andere angewiesen zu sein.",
        "Selbstbestimmung spielt eine zentrale Rolle in meinem täglichen Leben.",
        "Ich strebe danach, meine eigene Meinung zu bilden, unabhängig von der Meinung anderer.",
        "Die Freiheit, meine Zeit nach eigenem Ermessen zu gestalten, ist mir sehr wichtig."
    ],
    wissen: [
        "Ich setze mich regelmäßig mit neuen Themen auseinander, um mein Wissen zu erweitern.",
        "Das Streben nach Wissen ist eine der wichtigsten Motivationen in meinem Leben.",
        "Ich finde Freude daran, komplexe Probleme zu analysieren und zu verstehen.",
        "Ich investiere viel Zeit in das Lesen von Büchern und Fachartikeln.",
        "Wissenschaftliche Erkenntnisse beeinflussen maßgeblich meine Entscheidungen.",
        "Ich bin neugierig und suche ständig nach neuen Informationen.",
        "Bildung und Weiterbildung sind für mich essenziell, um persönlich zu wachsen.",
        "Ich diskutiere gerne über intellektuelle Themen mit anderen Menschen."
    ],
    sinn: [
        "Ich strebe danach, einen tieferen Sinn in meinen täglichen Aktivitäten zu finden.",
        "Mein Leben hat für mich einen klaren Zweck oder eine klare Richtung.",
        "Ich setze mir langfristige Ziele, die meinem Leben Bedeutung verleihen.",
        "Das Gefühl, etwas Bedeutungsvolles zu tun, motiviert mich täglich.",
        "Ich reflektiere regelmäßig über den Sinn meines Lebens.",
        "Ich engagiere mich in Aktivitäten, die meinem Leben einen tieferen Zweck geben.",
        "Es ist mir wichtig, dass meine Handlungen einen positiven Einfluss auf die Welt haben.",
        "Die Suche nach persönlichem Wachstum und Erfüllung ist für mich zentral."
    ]
};

let selectedQuestions = {
    autonomie: [],
    wissen: [],
    sinn: []
};

let currentQuestionIndex = 0;
let questions = [];
let responses = {
    autonomie: [],
    wissen: [],
    sinn: []
};

// Funktion zur zufälligen Auswahl von 4 Fragen pro Aspekt
function selectRandomQuestions() {
    for (let aspect in aspects) {
        let shuffled = aspects[aspect].sort(() => 0.5 - Math.random());
        selectedQuestions[aspect] = shuffled.slice(0, 4);
        questions = questions.concat(selectedQuestions[aspect].map(q => ({ aspect: aspect, text: q })));
    }
}

// Initiale Frageauswahl
selectRandomQuestions();

// Shuffle die 12 Fragen, um unterschiedliche Aspekte zu mischen
questions = questions.sort(() => 0.5 - Math.random());

// Render der aktuellen Frage
function renderQuestion() {
    const testDiv = document.getElementById('test');
    testDiv.innerHTML = '';

    if (currentQuestionIndex < questions.length) {
        const questionObj = questions[currentQuestionIndex];
        const questionNumber = currentQuestionIndex + 1;

        const questionContainer = document.createElement('div');
        questionContainer.classList.add('question-container');
        questionContainer.style.display = 'block';

        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');

        const questionText = document.createElement('p');
        questionText.textContent = `${questionNumber}. ${questionObj.text}`;
        questionDiv.appendChild(questionText);

        const optionsDiv = document.createElement('div');
        optionsDiv.classList.add('options');

        const scale = [
            { value: 1, label: "Stimme überhaupt nicht zu" },
            { value: 2, label: "Stimme nicht zu" },
            { value: 3, label: "Neutral" },
            { value: 4, label: "Stimme zu" },
            { value: 5, label: "Stimme voll und ganz zu" }
        ];

        scale.forEach(option => {
            const label = document.createElement('label');
            const input = document.createElement('input');
            input.type = 'radio';
            input.name = `question${currentQuestionIndex}`;
            input.value = option.value;
            label.appendChild(input);
            label.appendChild(document.createTextNode(` ${option.value} – ${option.label}`));
            optionsDiv.appendChild(label);
        });

        questionDiv.appendChild(optionsDiv);
        questionContainer.appendChild(questionDiv);
        testDiv.appendChild(questionContainer);

        // Zeige nur den Weiter-Button
        document.getElementById('nextBtn').textContent = currentQuestionIndex < questions.length - 1 ? 'Weiter' : 'Abschließen';

        // Fortschrittsleiste aktualisieren
        const progress = ((currentQuestionIndex) / questions.length) * 100;
        document.getElementById('progressBar').style.width = `${progress}%`;
    } else {
        // Letzte Frage beantwortet, Ergebnisse anzeigen
        // Setze den Fortschrittsbalken auf 100%
        document.getElementById('progressBar').style.width = `100%`;
        calculateResults();
    }
}

// Event Listener für "Weiter" Button
document.getElementById('nextBtn').addEventListener('click', function() {
    const testDiv = document.getElementById('test');
    const selectedOption = document.querySelector(`input[name="question${currentQuestionIndex}"]:checked`);
    if (!selectedOption) {
        alert("Bitte wähle eine Antwort aus, bevor du fortfährst.");
        return;
    }
    // Speichere die Antwort
    const answerValue = parseInt(selectedOption.value);
    const aspect = questions[currentQuestionIndex].aspect;
    responses[aspect].push(answerValue);

    currentQuestionIndex++;
    renderQuestion();
});

// ... (der restliche Code bleibt unverändert)

// Funktion zur Berechnung der Ergebnisse
function calculateResults() {
    // Verstecke die Fragen und Navigation
    document.getElementById('test').style.display = 'none';
    document.getElementById('navigation').style.display = 'none';

    // Berechne die Punktzahlen
    const autonomieScore = responses.autonomie.reduce((a, b) => a + b, 0);
    const wissenScore = responses.wissen.reduce((a, b) => a + b, 0);
    const sinnScore = responses.sinn.reduce((a, b) => a + b, 0);
    const gesamtScore = autonomieScore + wissenScore + sinnScore;

    // Zeige nur den Gesamtscore an
    document.getElementById('gesamtScore').textContent = `Gesamtscore: ${gesamtScore} Punkte`;

    // Setze die Canvas-Höhe für das Diagramm auf eine kleinere Größe
    const resultsChartCanvas = document.getElementById('resultsChart');
    resultsChartCanvas.height = 150; // Reduziere die Höhe des Diagramms

    // Chart.js Diagramm erstellen
    const ctx = resultsChartCanvas.getContext('2d');
    const resultsChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Autonomie', 'Wissen', 'Sinn/Purpose'],
            datasets: [{
                label: 'Punktzahl',
                data: [autonomieScore, wissenScore, sinnScore],
                backgroundColor: [
                    'rgba(0, 123, 255, 0.6)',
                    'rgba(23, 162, 184, 0.6)',
                    'rgba(255, 193, 7, 0.6)'
                ],
                borderColor: [
                    'rgba(0, 123, 255, 1)',
                    'rgba(23, 162, 184, 1)',
                    'rgba(255, 193, 7, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // Ermöglicht die Anpassung der Höhe
            scales: {
                y: {
                    beginAtZero: true,
                    max: 20 // Da max pro Aspekt 20 Punkte (4*5)
                }
            },
            plugins: {
                legend: {
                    display: false // Legende ausblenden, um Platz zu sparen
                },
                tooltip: {
                    enabled: true
                }
            }
        }
    });

    // Individuelle Auswertungen basierend auf den Punktzahlen
    const autonomieInterpretation = getAutonomieInterpretation(autonomieScore);
    const wissenInterpretation = getWissenInterpretation(wissenScore);
    const sinnInterpretation = getSinnInterpretation(sinnScore);

    // Setze die Interpretationstexte in den Modalen
    document.getElementById('autonomieInterpretation').textContent = autonomieInterpretation;
    document.getElementById('wissenInterpretation').textContent = wissenInterpretation;
    document.getElementById('sinnInterpretation').textContent = sinnInterpretation;

    // **Neue Anpassungen für Kompaktheit der Ergebnisausgabe:**

    // 1. Entferne das Logo, den Titel und den nachfolgenden Hinweis
    // Verwenden Sie bestehende Klassen und Tags
    const logo = document.querySelector('.logo');
    const title = document.querySelector('h1');
    const hint = document.querySelector('.intro');

    if (logo) logo.style.display = 'none';
    if (title) title.style.display = 'none';
    if (hint) hint.style.display = 'none';

    // 2. Verstecke den Fortschrittsbalken
    const progressContainer = document.querySelector('.progress-container');
    if (progressContainer) {
        progressContainer.style.display = 'none';
    }

    // 3. Ergebnis-Headline ist bereits innerhalb .result und wird zentriert

    // Zeige das Ergebnisfenster an
    document.getElementById('result').style.display = 'block';
}

// ... (der restliche Code bleibt unverändert)

// Individuelle Auswertung für Autonomie
function getAutonomieInterpretation(score) {
    if (score >= 20) { 
        return "Ihre sehr hohe Ausprägung in Autonomie signalisiert eine außergewöhnliche Selbstbestimmung und Unabhängigkeit. Sie übernehmen gerne Führungsrollen und treiben innovative Projekte eigenständig voran. Diese Eigenschaften machen Sie besonders geeignet für unternehmerische Tätigkeiten oder Positionen, die hohe Eigeninitiative und Entscheidungsfreude erfordern. Sie besitzen die Fähigkeit, visionäre Ziele zu setzen und konsequent zu verfolgen, was Sie zu einem starken Antrieb in jeder Organisation macht. Allerdings besteht die Möglichkeit, dass Ihre ausgeprägte Unabhängigkeit zu Spannungen in stark regulierten oder stark teamorientierten Umgebungen führen kann. Es wäre ratsam, Ihre Führungsfähigkeiten weiter zu verfeinern und gleichzeitig Techniken der effektiven Teamarbeit zu erlernen, um eine harmonische Balance zwischen Eigeninitiative und Zusammenarbeit zu gewährleisten. Dies kann Ihre berufliche Wirkungskraft erhöhen und Ihnen ermöglichen, in unterschiedlichsten beruflichen Kontexten erfolgreich zu sein.";
    } else if (score >= 16) { 
        return "Mit einer hohen Ausprägung in Autonomie verfügen Sie über eine ausgeprägte Selbstbestimmung und Unabhängigkeit. Sie neigen dazu, eigenständig Projekte zu initiieren und zu leiten, und treffen Entscheidungen mit großer Überzeugung. Diese Eigenschaften machen Sie zu einer wertvollen Ressource in dynamischen und innovationsgetriebenen Arbeitsumgebungen, wo Eigeninitiative und kreative Problemlösung gefragt sind. Allerdings könnte Ihre starke Unabhängigkeit manchmal zu Herausforderungen in stark strukturierten oder stark teamorientierten Kontexten führen. Es wäre vorteilhaft, Ihre Fähigkeiten zur Zusammenarbeit weiter auszubauen und Wege zu finden, Ihre Unabhängigkeit mit effektiver Teamarbeit zu kombinieren. Dies kann Ihre Führungsfähigkeiten weiter stärken und Ihre Fähigkeit verbessern, in verschiedenen beruflichen Situationen erfolgreich zu agieren.";
    } else if (score >= 12) { 
        return "Ihre mittlere Ausprägung in Autonomie zeigt, dass Sie sowohl selbstständiges Arbeiten als auch Teamarbeit schätzen. Sie können sich gut an verschiedene Arbeitsumgebungen anpassen und sind in der Lage, eigenständige Entscheidungen zu treffen, wenn es notwendig ist. Gleichzeitig genießen Sie die Zusammenarbeit mit anderen und profitieren von gemeinschaftlichen Anstrengungen. Diese Balance ermöglicht es Ihnen, flexibel auf unterschiedliche Anforderungen zu reagieren und sowohl in führenden als auch in unterstützenden Rollen effektiv zu agieren. Es könnte hilfreich sein, gezielt Gelegenheiten zu suchen, in denen Sie Ihre Führungsfähigkeiten weiterentwickeln können, ohne die Vorteile der Teamarbeit aus den Augen zu verlieren. Dies kann Ihre berufliche Vielseitigkeit und Ihre Fähigkeit, in diversen Projekten erfolgreich zu sein, weiter stärken.";
    } else if (score >= 8) { 
        return "Mit einer geringen Ausprägung in Autonomie bevorzugen Sie die Zusammenarbeit im Team und fühlen sich in kooperativen Umgebungen am wohlsten. Sie profitieren von klaren Anweisungen und schätzen die Unterstützung durch Kollegen und Vorgesetzte. Dennoch könnten Sie gelegentlich vor Herausforderungen stehen, wenn selbstständiges Handeln erforderlich ist. Es wäre vorteilhaft, sich bewusst in Projekten einzubringen, die Ihnen erlauben, eigenständig kleine Aufgaben zu übernehmen. Dies kann Ihr Selbstvertrauen stärken und Ihre Fähigkeit fördern, in Situationen mit weniger Anleitung erfolgreich zu agieren. Langfristig kann dies Ihre Flexibilität erhöhen und Ihnen ermöglichen, in vielfältigen beruflichen Kontexten effektiver zu arbeiten.";
    } else { 
        return "Ihre geringe Ausprägung in Autonomie deutet darauf hin, dass Sie stark auf externe Führung und klare Strukturen angewiesen sind. In Arbeitsumgebungen, die stark hierarchisch oder reglementiert sind, fühlen Sie sich vermutlich wohl und können effektiv agieren. Es könnte jedoch herausfordernd sein, sich in Situationen zurechtzufinden, die hohe Eigeninitiative und selbstständiges Handeln erfordern. Es empfiehlt sich, schrittweise Gelegenheiten zu suchen, bei denen Sie kleine Entscheidungen eigenständig treffen können, um Ihre Selbstständigkeit zu stärken und mehr Vertrauen in Ihre eigenen Fähigkeiten zu gewinnen. Dies kann langfristig zu einer ausgewogeneren Balance zwischen Teamarbeit und individueller Initiative führen.";
    }
}

// Individuelle Auswertung für Wissen
function getWissenInterpretation(score) {
    if (score >= 20) {
        return "Ihre sehr hohe Ausprägung im Bereich Wissen signalisiert eine unersättliche Neugier und ein starkes Bestreben nach intellektueller Weiterentwicklung. Sie führen eigene Forschungsprojekte, publizieren Fachartikel und tragen aktiv zur Wissensgemeinschaft bei. Ihre Fähigkeit, komplexe Konzepte zu verstehen und innovative Lösungen zu entwickeln, macht Sie zu einer treibenden Kraft in wissenschaftlichen und forschungsorientierten Umgebungen. Allerdings kann eine so intensive Fokussierung auf Wissen dazu führen, dass praktische Anwendungen vernachlässigt werden oder die Integration in weniger wissensintensive Teams erschwert wird. Es wäre ratsam, Ihre umfangreichen Kenntnisse gezielt einzusetzen, um praktische Probleme zu lösen und gleichzeitig Ihre sozialen und kollaborativen Fähigkeiten zu stärken, um in verschiedenen beruflichen Kontexten effektiv agieren zu können.";
    } else if (score >= 16) {
        return "Mit einer hohen Ausprägung im Bereich Wissen streben Sie aktiv nach kontinuierlicher intellektueller Entwicklung und erweitern regelmäßig Ihr Fachwissen. Sie engagieren sich in weiterführenden Bildungsmaßnahmen und nutzen Ihr umfangreiches Wissen strategisch, um berufliche und persönliche Ziele zu erreichen. Diese Eigenschaften machen Sie zu einem wertvollen Mitarbeiter in wissensintensiven Branchen, in denen tiefgehendes Verständnis und analytische Fähigkeiten gefragt sind. Es ist jedoch wichtig, darauf zu achten, dass Ihr Fokus auf Wissen nicht zu einer Vernachlässigung praktischer Aspekte führt. Es könnte hilfreich sein, Gelegenheiten zu suchen, bei denen Sie Ihr theoretisches Wissen direkt in die Praxis umsetzen können, um ein ausgewogenes Verhältnis zwischen Theorie und Anwendung zu gewährleisten.";
    } else if (score >= 12) {
        return "Ihre mittlere Ausprägung im Bereich Wissen zeigt, dass Sie ein ausgewogenes Verhältnis zwischen praktischem Wissen und theoretischer Bildung anstreben. Sie sind bereit, sich kontinuierlich weiterzubilden und neues Wissen zu erwerben, ohne dabei die praktische Anwendung aus den Augen zu verlieren. Diese Balance ermöglicht es Ihnen, in vielfältigen beruflichen Kontexten erfolgreich zu agieren, da Sie sowohl über grundlegende Fachkenntnisse als auch über die Fähigkeit zur praktischen Umsetzung verfügen. Es könnte vorteilhaft sein, spezifische Fachgebiete zu identifizieren, die Sie besonders interessieren, und gezielt daran zu arbeiten, Ihr Wissen in diesen Bereichen zu vertiefen. Dies kann Ihre berufliche Expertise erhöhen und Ihre Position in wissensintensiven Arbeitsfeldern stärken.";
    } else if (score >= 8) {
        return "Mit einer geringen Ausprägung im Bereich Wissen zeigen Sie ein gewisses Interesse an intellektueller Entwicklung, jedoch ohne eine starke Priorisierung. Sie nutzen Wissen effektiv, wenn es für konkrete Aufgaben oder Projekte erforderlich ist, verzichten aber oft auf tiefgehende theoretische Auseinandersetzungen. Dies kann in Berufen, die eine ausgewogene Mischung aus praktischem und theoretischem Wissen erfordern, von Vorteil sein, während in stark akademischen oder forschungsorientierten Feldern Verbesserungsbedarf besteht. Es wäre hilfreich, gezielt Gelegenheiten zur Weiterbildung zu suchen, die direkt mit Ihren beruflichen Zielen verknüpft sind, um Ihr Wissen zu vertiefen und Ihre beruflichen Möglichkeiten zu erweitern.";
    } else {
        return "Ihre sehr geringe Ausprägung im Bereich Wissen deutet darauf hin, dass formale Bildung und kontinuierliches Lernen für Sie weniger Priorität haben. Sie bevorzugen praktische Erfahrungen und setzen Wissen gezielt ein, wenn es unmittelbar benötigt wird. Dies kann in Berufen, die stark auf praktische Fertigkeiten angewiesen sind, von Vorteil sein, während in wissensintensiven oder spezialisierten Bereichen Herausforderungen bestehen könnten. Es wäre empfehlenswert, Wege zu finden, Ihr Interesse an Wissen zu wecken, beispielsweise durch die Teilnahme an praxisorientierten Weiterbildungsmaßnahmen oder durch das Lesen von Fachliteratur, die direkt mit Ihren beruflichen Interessen verbunden ist. Dies kann Ihr Fachwissen erweitern und Ihre Anpassungsfähigkeit in verschiedenen beruflichen Situationen erhöhen.";
    }
}
// Individuelle Auswertung für Sinn/Purpose
function getSinnInterpretation(score) {
    if (score >= 20) {
        return "Ihre sehr hohe Ausprägung im Bereich Sinn/Purpose zeigt, dass die Suche nach einem tiefen Lebenssinn und einer klaren Lebensmission zentral für Ihr Handeln und Ihre Entscheidungen ist. Sie haben eine ausgeprägte Vision, die alle Lebensbereiche durchdringt, und engagieren sich intensiv in Aktivitäten, die nicht nur persönliche Erfüllung, sondern auch einen positiven Einfluss auf die Gesellschaft haben. Diese Eigenschaften machen Sie zu einer inspirierenden Persönlichkeit, die in der Lage ist, bedeutende Veränderungen herbeizuführen und andere zu motivieren. Achten Sie darauf, flexibel zu bleiben, um auch in sich verändernden Kontexten effektiv zu agieren.";
    } else if (score >= 16) {
        return "Ihre hohe Ausprägung im Bereich Sinn/Purpose zeigt, dass Sie aktiv nach einem klaren Lebenszweck streben. Sie setzen sich tiefgehende, langfristige Ziele, die persönliches und gesellschaftliches Wachstum fördern. Diese Klarheit und Zielstrebigkeit tragen dazu bei, dass Sie in Ihrem persönlichen und beruflichen Leben fokussiert und motiviert bleiben. Es könnte hilfreich sein, Strategien zur Flexibilität zu entwickeln, um sich an unerwartete Veränderungen anzupassen, ohne Ihre grundlegenden Ziele aus den Augen zu verlieren.";
    } else if (score >= 12) {
        return "Ihre mittlere Ausprägung im Bereich Sinn/Purpose zeigt, dass Sie aktiv nach Bedeutung und Lebenssinn streben, dabei aber auch eine ausgewogene Balance im Alltag halten. Sie setzen sich sowohl persönliche als auch berufliche Ziele, die Ihnen Orientierung und Motivation bieten, sind jedoch flexibel genug, um sich an Veränderungen anzupassen. Diese Balance ermöglicht es Ihnen, sowohl erfüllende als auch pragmatische Entscheidungen zu treffen, was zu einem stabilen und zufriedenstellenden Lebensstil führt. Es könnte hilfreich sein, regelmäßige Reflexionszeiten einzuplanen, um Ihre Fortschritte zu überprüfen und sicherzustellen, dass Ihre Ziele weiterhin mit Ihren persönlichen Werten übereinstimmen. Darüber hinaus könnte die Teilnahme an Gruppen oder Gemeinschaften, die ähnliche Werte teilen, Ihre Suche nach Sinn und Zweck weiter unterstützen und bereichern.";
    } else if (score >= 8) {
        return "Mit einer geringen Ausprägung im Bereich Sinn/Purpose suchen Sie gelegentlich nach Bedeutung in bestimmten Lebensbereichen, haben jedoch keine klar definierten langfristigen Ziele. Ihre Lebensentscheidungen sind oft von äußeren Umständen oder kurzfristigen Interessen beeinflusst, was zu einer gewissen Flexibilität führt. Es könnte vorteilhaft sein, sich gezielt mit Ihren persönlichen Interessen und Werten auseinanderzusetzen, um klarere Lebensziele zu definieren. Das Führen eines Tagebuchs oder das regelmäßige Reflektieren über Ihre Erfahrungen kann Ihnen helfen, ein besseres Verständnis dafür zu entwickeln, was Ihnen im Leben wirklich wichtig ist. Darüber hinaus könnten Aktivitäten wie Freiwilligenarbeit oder die Teilnahme an Workshops zur persönlichen Entwicklung Ihnen dabei helfen, einen tieferen Sinn und eine klarere Lebensrichtung zu finden.";
    } else {
        return "Ihre sehr geringe Ausprägung im Bereich Sinn/Purpose deutet darauf hin, dass Sie Schwierigkeiten haben, einen tiefen Lebenssinn oder eine klare Lebensrichtung zu finden. Ihre Handlungen erfolgen oft ohne langfristige Zielsetzung, was zu einer gewissen Orientierungslosigkeit führen kann. Es könnte hilfreich sein, sich Zeit für Selbstreflexion zu nehmen und zu überlegen, welche persönlichen Werte und Ziele Ihnen wichtig sind. Das Setzen kleiner, erreichbarer Ziele kann Ihnen helfen, eine klarere Richtung zu entwickeln und ein Gefühl der Erfüllung zu finden. Es könnte auch unterstützend sein, sich mit Mentoren oder Beratern auszutauschen, um eine tiefere Einsicht in Ihre persönlichen und beruflichen Bestrebungen zu gewinnen.";
    }
}

// Funktionen für modale Fenster
function showModal(aspect) {
    document.getElementById(`${aspect}Modal`).style.display = 'block';
    let interpretation;
    if(aspect === 'autonomie') {
        interpretation = getAutonomieInterpretation(responses.autonomie.reduce((a,b) => a + b, 0));
    } else if(aspect === 'wissen') {
        interpretation = getWissenInterpretation(responses.wissen.reduce((a,b) => a + b, 0));
    } else if(aspect === 'sinn') {
        interpretation = getSinnInterpretation(responses.sinn.reduce((a,b) => a + b, 0));
    }
    document.getElementById(`${aspect}Interpretation`).textContent = interpretation;
}

function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// Funktion zum Zurückkehren zum Start
function returnToStart() {
    window.location.href = '../index.html';
}

// Schließe die modalen Fenster, wenn außerhalb geklickt wird
window.onclick = function(event) {
    const modals = document.getElementsByClassName('modal');
    for(let i=0; i < modals.length; i++) {
        if (event.target == modals[i]) {
            modals[i].style.display = "none";
        }
    }
}

// Initiale Renderung der ersten Frage
renderQuestion();
