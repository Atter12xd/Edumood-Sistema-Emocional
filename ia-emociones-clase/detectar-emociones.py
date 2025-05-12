from deepface import DeepFace
import cv2
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
import os

traduccion_emociones = {
    "happy": "Feliz",
    "angry": "Molesto",
    "neutral": "Serio",
    "surprise": "Sorpresa",
    "sad": "Triste",
    "fear": "Miedo"
}

# Ingresar nombre del alumno al iniciar
alumno = input("👤 Ingresa el nombre del alumno: ").strip()

# Inicializar cámara
cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)

# Crear lista para guardar resultados
resultados = []

print("Presiona 'q' para salir")

# Emociones clave (procesadas en inglés)
emociones_clave = ["neutral", "happy", "angry", "surprise"]
emociones_negativas = ["angry", "sad", "fear"]
emociones_positivas_esp = ["Feliz", "Sorpresa", "Serio"]
emociones_negativas_esp = ["Molesto", "Triste", "Miedo"]

contador_negativas = 0

while True:
    ret, frame = cap.read()
    if not ret:
        break

    try:
        analysis = DeepFace.analyze(frame, actions=['emotion'], enforce_detection=False)
        emotion = analysis[0]['dominant_emotion']
        timestamp = datetime.now().strftime('%Y-%m-%d %H:%M:%S')

        print(f"[{timestamp}] Emoción detectada: {emotion}")

        if emotion in emociones_clave + emociones_negativas:
            emocion_es = traduccion_emociones.get(emotion, emotion)

            resultados.append({
                "alumno": alumno,
                "fecha_hora": timestamp,
                "emocion": emocion_es
            })

            if emotion in emociones_negativas:
                contador_negativas += 1

            # Mostrar emoción en pantalla
            cv2.putText(frame, f'{alumno} - {emocion_es}', (20, 50),
                        cv2.FONT_HERSHEY_SIMPLEX, 1, (0, 255, 0), 2)

    except Exception as e:
        print("Error al analizar:", e)

    cv2.imshow('Detección Emocional', frame)

    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Cerrar cámara
cap.release()
cv2.destroyAllWindows()

# Guardar resultados en CSV
if len(resultados) > 0:
    df = pd.DataFrame(resultados)
    df.to_csv("emociones_detectadas.csv", index=False)
    print("✅ Archivo guardado: emociones_detectadas.csv")

    # Mostrar resumen en porcentaje
    print("\n📊 Resumen emocional (porcentaje):")
    emocion_porcentajes = df['emocion'].value_counts(normalize=True) * 100
    for emocion, porcentaje in emocion_porcentajes.items():

        print(f"{emocion}: {porcentaje:.1f}%")

    # Alerta simulada
    alerta = False
    if contador_negativas >= 3:
        alerta = True
        print(f"\n🚨 ALERTA: Se detectaron {contador_negativas} emociones negativas en la sesión de {alumno}.")
        print("Se recomienda revisar el caso con el área de psicología.")
    else:
        print("\n🙂 No se detectaron patrones emocionales de riesgo.")

    # Crear gráfica de barras con porcentajes
    positivas = df[df['emocion'].isin(emociones_positivas_esp)].shape[0]
    negativas = df[df['emocion'].isin(emociones_negativas_esp)].shape[0]
    total = positivas + negativas

    porcentaje_positivas = (positivas / total) * 100 if total > 0 else 0
    porcentaje_negativas = (negativas / total) * 100 if total > 0 else 0

    plt.figure(figsize=(6, 4))
    bars = plt.bar(['Emociones positivas', 'Emociones negativas'], [porcentaje_positivas, porcentaje_negativas], color=['blue', 'red'])
    for bar in bars:
        yval = bar.get_height()
        plt.text(bar.get_x() + bar.get_width()/2, yval + 1, f"{yval:.1f}%", ha='center', va='bottom', fontsize=12)

    plt.title(f'Análisis Emocional de {alumno}')
    plt.ylabel('Porcentaje de emociones detectadas')
    plt.ylim(0, 100)
    plt.tight_layout()

    # Guardar imagen
    grafico_path = f"reporte_{alumno.replace(' ', '_')}.png"
    plt.savefig(grafico_path)
    print(f"\n📸 Imagen de resumen guardada como: {grafico_path}")

    # Mostrar imagen automáticamente
    try:
        from PIL import Image
        img = Image.open(grafico_path)
        img.show()
    except:
        print("⚠️ No se pudo abrir la imagen automáticamente.")

    # Generar informe de texto
    informe_path = f"informe_{alumno.replace(' ', '_')}.txt"
    with open(informe_path, "w", encoding="utf-8") as f:
        f.write(f"📄 Informe de Análisis Emocional\n")
        f.write(f"Alumno: {alumno}\n")
        f.write(f"Fecha del informe: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}\n\n")
        f.write("Resumen de emociones detectadas (porcentaje):\n")
        for emocion, porcentaje in emocion_porcentajes.items():
            f.write(f"{emocion}: {porcentaje:.1f}%\n")
        f.write("\n\n")

        if alerta:
            f.write("🚨 Se detectaron emociones negativas de forma repetida.\n")
            f.write("⚠️ Recomendación: derivar al área de psicología.\n")
        else:
            f.write("🙂 No se detectaron patrones de riesgo emocional.\n")

    print(f"📝 Informe generado: {informe_path}")

else:
    print("⚠️ No se detectaron emociones clave. No se generó el archivo.")
