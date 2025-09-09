import numpy as np
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D
import io
import base64
from typing import List, Dict, Any, Tuple
from qiskit.visualization import plot_bloch_vector
from qiskit.quantum_info import Statevector
import matplotlib
matplotlib.use('Agg')  # Use non-interactive backend

def plot_bloch_sphere_streamlit_style(vec: Tuple[float, float, float], title: str = "Bloch Sphere") -> str:
    """
    Generate Bloch sphere exactly like the Streamlit app using Plotly.
    """
    try:
        import plotly.graph_objects as go
        import plotly.offline as pyo
        
        # Create a sphere surface exactly like Streamlit
        u = np.linspace(0, 2 * np.pi, 60)
        v = np.linspace(0, np.pi, 30)
        x = np.outer(np.cos(u), np.sin(v))
        y = np.outer(np.sin(u), np.sin(v))
        z = np.outer(np.ones_like(u), np.cos(v))

        bx, by, bz = vec

        fig = go.Figure()
        fig.add_surface(x=x, y=y, z=z, opacity=0.2, showscale=False)
        
        # Axes exactly like Streamlit
        axis_len = 1.1
        fig.add_trace(go.Scatter3d(x=[-axis_len, axis_len], y=[0, 0], z=[0, 0], mode='lines', name='X'))
        fig.add_trace(go.Scatter3d(x=[0, 0], y=[-axis_len, axis_len], z=[0, 0], mode='lines', name='Y'))
        fig.add_trace(go.Scatter3d(x=[0, 0], y=[0, 0], z=[-axis_len, axis_len], mode='lines', name='Z'))

        # Bloch vector exactly like Streamlit
        fig.add_trace(go.Scatter3d(x=[0, bx], y=[0, by], z=[0, bz], mode='lines+markers', name='State'))

        fig.update_layout(title=title, scene=dict(xaxis_title='X', yaxis_title='Y', zaxis_title='Z',
                                                  aspectmode='cube'))
        
        # Generate HTML
        config = {
            'displayModeBar': True,
            'displaylogo': False,
            'responsive': True
        }
        
        html_content = pyo.plot(fig, output_type='div', include_plotlyjs=True, config=config)
        
        full_html = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>{title}</title>
            <style>
                body {{
                    margin: 0;
                    padding: 0;
                    background-color: white;
                    font-family: Arial, sans-serif;
                }}
                .plotly-graph-div {{
                    height: 100vh !important;
                    width: 100% !important;
                }}
            </style>
        </head>
        <body>
            {html_content}
        </body>
        </html>
        """
        
        return full_html
        
    except Exception as e:
        return generate_matplotlib_fallback_html([{'x': vec[0], 'y': vec[1], 'z': vec[2]}], title, str(e))

def generate_interactive_bloch_html(vectors: List[Dict[str, float]], title: str = "Bloch Sphere") -> str:
    """
    Generate interactive Bloch sphere visualization using the Streamlit approach.
    """
    # For single qubit, use the exact Streamlit approach
    if len(vectors) == 1:
        vec = vectors[0]
        return plot_bloch_sphere_streamlit_style((vec['x'], vec['y'], vec['z']), title)
    
    # For multiple qubits, show the first one (can be extended later)
    if vectors:
        vec = vectors[0]
        return plot_bloch_sphere_streamlit_style((vec['x'], vec['y'], vec['z']), f"{title} - {vec.get('label', 'q0')}")
    
    # Default |0⟩ state
    return plot_bloch_sphere_streamlit_style((0.0, 0.0, 1.0), title)


def generate_matplotlib_bloch_html(vectors: List[Dict[str, float]], title: str = "Bloch Sphere") -> str:
    """
    Fallback: Generate Bloch sphere with matplotlib and embed in HTML.
    """
    # Generate the image
    image_base64 = generate_bloch_sphere_image(vectors, title)
    
    html = f"""
    <!DOCTYPE html>
    <html>
    <head>
        <title>Bloch Sphere Visualization</title>
        <style>
            body {{
                margin: 0;
                padding: 20px;
                background: transparent;
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100vh;
                font-family: Arial, sans-serif;
            }}
            .bloch-container {{
                text-align: center;
                background: white;
                border-radius: 10px;
                padding: 20px;
                box-shadow: 0 4px 20px rgba(0,0,0,0.1);
            }}
            img {{
                max-width: 100%;
                height: auto;
                border-radius: 8px;
            }}
            h2 {{
                color: #333;
                margin-bottom: 20px;
            }}
        </style>
    </head>
    <body>
        <div class="bloch-container">
            <h2>{title}</h2>
            <img src="data:image/png;base64,{image_base64}" alt="Bloch Sphere" />
        </div>
    </body>
    </html>
    """
    return html


def generate_bloch_sphere_image(vectors: List[Dict[str, float]], title: str = "Bloch Sphere", rotation_angle: float = 0) -> str:
    """
    Generate a Bloch sphere visualization using matplotlib and return as base64 encoded image.
    
    Args:
        vectors: List of dictionaries with 'x', 'y', 'z' coordinates
        title: Title for the plot
    
    Returns:
        Base64 encoded PNG image string
    """
    fig = plt.figure(figsize=(10, 8))
    ax = fig.add_subplot(111, projection='3d')
    
    # Create sphere surface
    u = np.linspace(0, 2 * np.pi, 50)
    v = np.linspace(0, np.pi, 50)
    x_sphere = np.outer(np.cos(u), np.sin(v))
    y_sphere = np.outer(np.sin(u), np.sin(v))
    z_sphere = np.outer(np.ones(np.size(u)), np.cos(v))
    
    # Plot semi-transparent sphere
    ax.plot_surface(x_sphere, y_sphere, z_sphere, alpha=0.3, color='lightblue')
    
    # Plot coordinate axes
    axis_length = 1.2
    ax.plot([-axis_length, axis_length], [0, 0], [0, 0], 'r-', linewidth=2, alpha=0.8)
    ax.plot([0, 0], [-axis_length, axis_length], [0, 0], 'g-', linewidth=2, alpha=0.8)
    ax.plot([0, 0], [0, 0], [-axis_length, axis_length], 'b-', linewidth=2, alpha=0.8)
    
    # Add axis labels
    ax.text(axis_length + 0.1, 0, 0, 'X', fontsize=12, color='red')
    ax.text(0, axis_length + 0.1, 0, 'Y', fontsize=12, color='green')
    ax.text(0, 0, axis_length + 0.1, 'Z', fontsize=12, color='blue')
    
    # Plot state vectors
    colors = ['red', 'orange', 'purple', 'cyan', 'magenta', 'yellow']
    for i, vector in enumerate(vectors):
        if vector['x'] == 0 and vector['y'] == 0 and vector['z'] == 0:
            continue
            
        color = colors[i % len(colors)]
        
        # Plot vector arrow
        ax.quiver(0, 0, 0, vector['x'], vector['y'], vector['z'], 
                 color=color, arrow_length_ratio=0.1, linewidth=3)
        
        # Add vector endpoint marker
        ax.scatter([vector['x']], [vector['y']], [vector['z']], 
                  color=color, s=100)
        
        # Add label if available
        label = vector.get('label', f'q{i}')
        ax.text(vector['x'] + 0.1, vector['y'] + 0.1, vector['z'] + 0.1, 
               label, fontsize=10, color=color)
    
    # Set equal aspect ratio and limits
    ax.set_xlim([-1.2, 1.2])
    ax.set_ylim([-1.2, 1.2])
    ax.set_zlim([-1.2, 1.2])
    ax.set_xlabel('X')
    ax.set_ylabel('Y')
    ax.set_zlabel('Z')
    ax.set_title(title, fontsize=14, pad=20)
    
    # Set view angle for rotation
    ax.view_init(elev=20, azim=rotation_angle)
    
    # Set dark background
    fig.patch.set_facecolor('#1e1e2e')
    ax.xaxis.pane.fill = False
    ax.yaxis.pane.fill = False
    ax.zaxis.pane.fill = False
    ax.xaxis.pane.set_edgecolor('white')
    ax.yaxis.pane.set_edgecolor('white')
    ax.zaxis.pane.set_edgecolor('white')
    ax.xaxis.pane.set_alpha(0.1)
    ax.yaxis.pane.set_alpha(0.1)
    ax.zaxis.pane.set_alpha(0.1)
    
    # White text and grid
    ax.tick_params(colors='white')
    ax.xaxis.label.set_color('white')
    ax.yaxis.label.set_color('white')
    ax.zaxis.label.set_color('white')
    ax.title.set_color('white')
    
    # Save to bytes buffer
    buffer = io.BytesIO()
    plt.savefig(buffer, format='png', bbox_inches='tight', 
                facecolor='#1e1e2e', edgecolor='none', dpi=150)
    buffer.seek(0)
    
    # Convert to base64
    image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
    
    plt.close(fig)  # Clean up
    return image_base64


def generate_bloch_sphere_qiskit(vectors: List[Dict[str, float]]) -> str:
    """
    Alternative implementation using Qiskit's built-in Bloch sphere visualization.
    """
    try:
        from qiskit.visualization import plot_bloch_vector
        import matplotlib.pyplot as plt
        
        if not vectors or len(vectors) == 0:
            # Default to |0⟩ state
            vectors = [{'x': 0, 'y': 0, 'z': 1, 'label': 'q0'}]
        
        # Use first vector for Qiskit visualization
        vector = vectors[0]
        bloch_vector = [vector['x'], vector['y'], vector['z']]
        
        fig = plot_bloch_vector(bloch_vector, title="Quantum State")
        
        # Set dark theme
        fig.patch.set_facecolor('#1e1e2e')
        
        # Save to buffer
        buffer = io.BytesIO()
        plt.savefig(buffer, format='png', bbox_inches='tight',
                   facecolor='#1e1e2e', edgecolor='none', dpi=150)
        buffer.seek(0)
        
        image_base64 = base64.b64encode(buffer.getvalue()).decode('utf-8')
        plt.close(fig)
        
        return image_base64
        
    except ImportError:
        # Fallback to custom implementation
        return generate_bloch_sphere_image(vectors)
