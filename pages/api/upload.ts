import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "POST") {
        return res.status(405).json({ error: true, message: "Method not allowed" });
    }
    const { imageData } = req.body;

    if (!imageData) {
        return res.status(400).json({ error: true, message: "Image data is required" });
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}`;

    const prompt = `You have been given an image with some mathematical expressions, equations, or graphical problems, and you need to solve them.
Note: Use the PEMDAS rule for solving mathematical expressions. PEMDAS stands for the Priority Order: Parentheses, Exponents, Multiplication and Division (from left to right), Addition and Subtraction (from left to right). Parentheses have the highest priority, followed by Exponents, then Multiplication and Division, and lastly Addition and Subtraction.

Examples:
	•	Q: 2 + 3 * 4
	•	(3 * 4) => 12, 2 + 12 = 14.
	•	Q: 2 + 3 + 5 * 4 - 8 / 2
	•	5 * 4 => 20, 8 / 2 => 4, 2 + 3 => 5, 5 + 20 => 25, 25 - 4 => 21.

Special Rule for ￼:
	•	If ￼ appears in the input (as part of an equation, expression, or variable assignment), the output must include ￼, with ￼’s value calculated explicitly.

You can have five types of equations/expressions in this image, and only one case shall apply every time:
	1.	Simple mathematical expressions like 2 + 2, 3 * 4, 5 / 6, 7 - 8, etc.:
	•	In this case, solve and return the answer in the format of a list of one dictionary, where the expr is represented in LaTeX:

[
  {
    "expr": "2 + 2",
    "result": 4
  }
]


	2.	Set of equations like x^2 + 2x + 1 = 0, 3y + 4x = 0, etc.:
	•	Solve for the variables, ensuring ￼ is explicitly included as ￼, and return a list of dictionaries, where the expr is represented in LaTeX:

[
  {
    "expr": "x = 2",
    "result": 2,
    "assign": true
  },
  {
    "expr": "y = 5",
    "result": 5,
    "assign": true
  }
]


	3.	Assigning values to variables like x = 4, y = 5, etc.:
	•	Assign values to variables, ensuring ￼ is explicitly included as ￼, and return a list of dictionaries, where the expr is represented in LaTeX:

[
  {
    "expr": "x = 4",
    "result": 4,
    "assign": true
  }
]


	4.	Graphical math problems such as trigonometric problems, Pythagorean theorem, etc.:
	•	Solve and return the result in the format of a list of one dictionary, where the expr is represented in LaTeX:

[
  {
    "expr": "a^2 + b^2 = c^2",
    "result": "c = 5"
  }
]


	5.	Abstract concepts detected from drawings (e.g., love, patriotism):
	•	Return a list of one dictionary, where expr is represented in LaTeX, and result is the abstract concept:

[
  {
    "expr": "Heart → Love",
    "result": "love"
  }
]

Error Handling

If the input cannot be solved, return an error with the following structure:

{
  "error": true,
  "message": "Unable to solve the given input. Please check the format or content of the problem."
}

Additional Guidelines:
	•	Use PEMDAS for mathematical calculations.
	•	Ensure expr is represented in LaTeX without unnecessary escape characters like \\text{} or double backslashes \\.
	•	Return ￼ explicitly whenever ￼ is part of the input.
	•	Return data in proper JSON format, ensuring all keys and values are quoted.
	•	If variables in the expression are pre-assigned, use their values from this dictionary: {dict_of_vars_str}.
	•	Avoid unnecessary formatting like triple backticks.`;

    try {
        const response = await axios.post(url, {
            contents: [
                {
                    parts: [
                        { text: prompt },
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: imageData,
                            },
                        },
                    ],
                },
            ],
        });

        const data = response.data;

        let text = data.candidates[0].content.parts[0].text;
        text = text.replace(/```json|```/g, "").trim();
        text = JSON.parse(text);

        return res.status(200).json(text);
    } catch (error) {
        return res.status(500).json({ error: true, message: error });
    }
}
