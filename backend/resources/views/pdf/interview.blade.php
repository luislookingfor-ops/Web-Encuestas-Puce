<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Entrevista - {{ $interview->interviewee_name }}</title>
    <style>
        body {
            font-family: 'Helvetica', 'Arial', sans-serif;
            margin: 0;
            padding: 0;
            color: #333;
        }
        .header {
            background-color: #1e3a8a; /* Blue-900 */
            color: white;
            padding: 20px;
            margin-bottom: 20px;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            text-transform: uppercase;
        }
        .header p {
            margin: 5px 0 0;
            color: #fbbf24; /* Yellow-400 */
            font-size: 14px;
        }
        .section-title {
            background-color: #2563eb; /* Blue-600 */
            color: white;
            padding: 10px 15px;
            font-size: 14px;
            font-weight: bold;
            text-transform: uppercase;
            margin-bottom: 15px;
        }
        .container {
            padding: 0 20px;
        }
        .row {
            margin-bottom: 15px;
            display: table;
            width: 100%;
        }
        .col-photo {
            display: table-cell;
            width: 180px;
            vertical-align: top;
        }
        .col-details {
            display: table-cell;
            vertical-align: top;
            padding-left: 20px;
        }
        .photo-box {
            width: 150px;
            height: 180px;
            border: 2px dashed #ccc;
            text-align: center;
            line-height: 1.2;
            color: #999;
            font-size: 10px;
            overflow: hidden;
        }
        .photo-box img {
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
        .field {
            margin-bottom: 10px;
            border-bottom: 1px dashed #ccc;
            padding-bottom: 3px;
        }
        .label {
            font-weight: bold;
            color: #666;
            font-size: 12px;
            width: 120px;
            display: inline-block;
        }
        .value {
            font-size: 12px;
            color: #333;
        }
        .table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
        }
        .table th {
            background-color: #1e3a8a;
            color: white;
            padding: 10px;
            text-align: left;
            font-size: 11px;
            text-transform: uppercase;
        }
        .table td {
            border: 1px solid #e5e7eb;
            padding: 10px;
            font-size: 11px;
            vertical-align: top;
        }
        .q-num {
            color: #2563eb;
            font-weight: bold;
        }
        .footer {
            margin-top: 30px;
            background-color: #fbbf24;
            padding: 10px;
            font-size: 9px;
            font-weight: bold;
            text-align: center;
        }
        .checkbox {
            display: inline-block;
            width: 12px;
            height: 12px;
            border: 1px solid #333;
            text-align: center;
            line-height: 12px;
            font-size: 10px;
            margin-right: 5px;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>PLANTILLA 5: Registro de Entrevista</h1>
        <p>Todas las entrevistas validan la HIPÓTESIS APROBADA por el docente · Mínimo 10 por estudiante</p>
    </div>

    <div class="container">
        <div class="section-title">DATOS DEL ENTREVISTADO</div>

        <div class="row">
            <div class="col-photo">
                <div class="photo-box">
                    @if($interview->photo_path)
                        <img src="{{ storage_path('app/public/' . $interview->photo_path) }}" alt="Foto">
                    @else
                        <br><br><br>FOTO obligatoria del entrevistado
                    @endif
                </div>
            </div>
            <div class="col-details">
                <div class="field"><span class="label">Nombre Completo:</span> <span class="value">{{ $interview->interviewee_name }}</span></div>
                <div class="field"><span class="label">Cargo / Ocupación:</span> <span class="value">{{ $interview->current_role }}</span></div>
                <div class="field"><span class="label">Institución:</span> <span class="value">{{ $interview->organization }}</span></div>
                <div class="field">
                    <span class="label">Tipo de cliente:</span>
                    <span class="value">
                        <span class="checkbox">{{ $interview->client_type == 'Usuario Final' ? 'x' : '' }}</span> Usuario Final 
                        <span class="checkbox">{{ $interview->client_type == 'Pagador' ? 'x' : '' }}</span> Pagador 
                        <span class="checkbox">{{ $interview->client_type == 'Decisor' ? 'x' : '' }}</span> Decisor 
                        <span class="checkbox">{{ $interview->client_type == 'Influenciador' ? 'x' : '' }}</span> Influenciador 
                        <span class="checkbox">{{ $interview->client_type == 'Experto' ? 'x' : '' }}</span> Experto
                    </span>
                </div>
                <div class="field">
                    <span class="label">Valida hipótesis:</span>
                    <span class="value">
                        <span style="font-style: italic; color: #059669;">APROBADA por el docente</span> 
                        <span class="checkbox" style="background-color: #d1fae5;">{{ $interview->validates_hypothesis ? '✓' : '' }}</span>
                        <span style="font-size: 10px; color: #999;"> — todas las entrevistas son sobre la misma</span>
                    </span>
                </div>
                <div class="field">
                    <span class="label">Fecha y lugar:</span>
                    <span class="value">{{ $interview->date }} · Lugar: {{ $interview->location }}</span>
                </div>
            </div>
        </div>

        <table class="table">
            <thead>
                <tr>
                    <th width="30%">PREGUNTA</th>
                    <th width="35%">RESPUESTA LITERAL DEL ENTREVISTADO</th>
                    <th width="35%">APRENDIZAJE / INSIGHT</th>
                </tr>
            </thead>
            <tbody>
                @foreach($interview->responses as $index => $response)
                <tr>
                    <td><span class="q-num">P {{ $index + 1 }}:</span><br>{{ $response->question->question_text }}</td>
                    <td>{{ $response->literal_response }}</td>
                    <td>{{ $response->learning_insight }}</td>
                </tr>
                @endforeach
            </tbody>
        </table>
    </div>

    <div class="footer">
        ★ No olvidar: Escribir respuestas LITERALES · Anotar lenguaje corporal · No sugerir respuestas · Duplicar esta plantilla para cada entrevista, SI REQUIERES MAS PREGUNTAS AUMENTALAS EN OTRA DIAPOSITIVA
    </div>
</body>
</html>
