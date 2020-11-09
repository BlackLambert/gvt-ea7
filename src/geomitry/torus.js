// Copyright: Sebastian Baier (sebastian.baier93@hotmail.de) 2020

class Torus extends GLObject
{
    constructor(localPosition, localRotation, localScale, vertices, faces, wireframe)
    {
        super(localPosition, localRotation, localScale, vertices, faces, wireframe);
    }

    static createBasic(innerRadius, outerRadius, uResolution, vResolution, localPosition, lineColor, faceColor)
    {
        const torusMinU = 0;
        const torusMaxU = 2 * Math.PI;
        const torusMinV = 0;
        const torusMaxV = 2 * Math.PI;
        const torusDeltaV= (torusMaxV - torusMinV) / vResolution;
        const torusDeltaU = (torusMaxU - torusMinU) / uResolution;
        const meshVerticesCount = uResolution * vResolution;

        const r = (outerRadius - innerRadius)/2;
        const R = innerRadius + r;
        const p = localPosition;
        let vertices = [];
        let triangulation = Triangulation.createEmpty();

        for(let i = 0; i<=vResolution; i++)
        {
            for(let j = 0; j<=uResolution; j++)
            {
                let index = j+i*uResolution;

                if(i<vResolution && j<uResolution)
                {
                    let u = torusMinU + j*torusDeltaU;
                    let v = torusMinV + i*torusDeltaV;

                    let x = (R + r * Math.cos(u)) * Math.cos(v);
                    let y = (R + r * Math.cos(u)) * Math.sin(v);
                    let z = r * Math.sin(u);
                    
                    vertices.push(new Vertex(new Vector3(x,y,z), index));
                }

                if(i > 0 && j > 0)
                {
                    let i1 = index - 1 - uResolution;
                    let i2 = (index - 1) % meshVerticesCount;
                    let i3 = ((j % uResolution) + i * uResolution) % meshVerticesCount;
                    let i4 = (j % uResolution) + i * uResolution - uResolution;
                    triangulation.combine(Triangulation.triangulateFour([vertices[i1], vertices[i4], vertices[i3], vertices[i2]]));
                }
            }
        }

        let result = new Torus(p, Vector3.zero(), Vector3.one(), vertices, triangulation.faces, triangulation.lines);
        result.removeDoubleLines();
        result.setFaceColor(faceColor);
        result.setWireframeColor(lineColor);
        return result;
    }
}