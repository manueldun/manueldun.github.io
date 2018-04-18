function esVocal(letra)
{
	if (typeof letra == String)
	{
		letra = letra.toLowerCase();
	}
	return letra == 'a' || letra == 'e' || letra == 'i' || letra == 'o' || letra ==
		'u' || letra == 'á' || letra == 'é' || letra == 'í' || letra == 'ó' || letra ==
		'ú';
}

function esVocalCerradaAtona(vocal)
{
	if (typeof vocal == String)
	{
		vocal = vocal.toString().toLowerCase();
	}
	return vocal == 'i' || vocal == 'u';
}

function esHiato(vocal1, vocal2) //es separable
{
	if (typeof vocal1 == String && typeof vocal2 == String)
	{
		vocal1 = vocal1.toString().toLowerCase();
		vocal2 = vocal2.toString().toLowerCase();
	}
	return (vocal1 !== vocal2) || esVocalCerradaAtona(vocal1) ||
		esVocalCerradaAtona(vocal2);
}

function contarSilabas(palabra)
{
	conteo = 0;
	if (palabra.length == 0) //caso especial: texto vacio
	{
		return 0;
	}
	if (palabra.length <= 2) //caso especial: monosílabo de dos letras
	{
		return 1;
	}
	for (var i = 1; i < palabra.length; i++)
	{
		if (esVocal(palabra[i]))
		{
			if (!esVocal(palabra[i + 1]))
			{
				if (esVocal(palabra[i - 1])) //si hay dos vocales seguidas
				{
					if (esHiato(palabra[i - 1], palabra[i]))
					{
						conteo += 2;
					}
					else
					{
						conteo++;
					}
				}
				else
				{
					conteo++;
				}
			}
		}
	}
	return conteo;
}

function contarPalabras(texto)
{
	texto = texto.match(/[a-zA-Záéíóúüñ]+/g);
	if (texto == null)
	{
		return 0;
	}
	return texto.length;
}

function contarOraciones(texto)
{
	if (texto.length == 0)
	{
		return 0;
	}
	var matches = texto.match(/[^,.?¿!¡\[\]\{\}]+/g);
	if (matches == null)
	{
		return 1;
	}
	else matches
	{
		return matches.length;
	}
}

function pruebaFernandez_Huerta(numeroSilabas, numeroPalabras, numeroOraciones)
{
	return 206.84 - 0.6 * (numeroSilabas / numeroPalabras) * 100.0 - 1.02 * (
		numeroOraciones / numeroPalabras) * 100.0;
}
