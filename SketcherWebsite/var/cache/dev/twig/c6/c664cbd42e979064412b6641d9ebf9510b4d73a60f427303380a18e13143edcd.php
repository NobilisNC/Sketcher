<?php

/* @WebProfiler/Collector/router.html.twig */
class __TwigTemplate_14507edd2086fd5a91f30f336fc76d91e369ff93410c5cf834f74b6b5616b409 extends Twig_Template
{
    public function __construct(Twig_Environment $env)
    {
        parent::__construct($env);

        // line 1
        $this->parent = $this->loadTemplate("@WebProfiler/Profiler/layout.html.twig", "@WebProfiler/Collector/router.html.twig", 1);
        $this->blocks = array(
            'toolbar' => array($this, 'block_toolbar'),
            'menu' => array($this, 'block_menu'),
            'panel' => array($this, 'block_panel'),
        );
    }

    protected function doGetParent(array $context)
    {
        return "@WebProfiler/Profiler/layout.html.twig";
    }

    protected function doDisplay(array $context, array $blocks = array())
    {
        $__internal_97d7258ca375467818733b6a95df19d1e105726944d7295d3663c46572a2f08f = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_97d7258ca375467818733b6a95df19d1e105726944d7295d3663c46572a2f08f->enter($__internal_97d7258ca375467818733b6a95df19d1e105726944d7295d3663c46572a2f08f_prof = new Twig_Profiler_Profile($this->getTemplateName(), "template", "@WebProfiler/Collector/router.html.twig"));

        $this->parent->display($context, array_merge($this->blocks, $blocks));
        
        $__internal_97d7258ca375467818733b6a95df19d1e105726944d7295d3663c46572a2f08f->leave($__internal_97d7258ca375467818733b6a95df19d1e105726944d7295d3663c46572a2f08f_prof);

    }

    // line 3
    public function block_toolbar($context, array $blocks = array())
    {
        $__internal_f18151e72845e66c45cf762ecc465ea728261e1eadcd2c129aa2bc11794af72e = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_f18151e72845e66c45cf762ecc465ea728261e1eadcd2c129aa2bc11794af72e->enter($__internal_f18151e72845e66c45cf762ecc465ea728261e1eadcd2c129aa2bc11794af72e_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "toolbar"));

        
        $__internal_f18151e72845e66c45cf762ecc465ea728261e1eadcd2c129aa2bc11794af72e->leave($__internal_f18151e72845e66c45cf762ecc465ea728261e1eadcd2c129aa2bc11794af72e_prof);

    }

    // line 5
    public function block_menu($context, array $blocks = array())
    {
        $__internal_a0012df4e72668a7d3d05014e14882c8a1d85c1e9c44d8f78366892278759d27 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_a0012df4e72668a7d3d05014e14882c8a1d85c1e9c44d8f78366892278759d27->enter($__internal_a0012df4e72668a7d3d05014e14882c8a1d85c1e9c44d8f78366892278759d27_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "menu"));

        // line 6
        echo "<span class=\"label\">
    <span class=\"icon\">";
        // line 7
        echo twig_include($this->env, $context, "@WebProfiler/Icon/router.svg");
        echo "</span>
    <strong>Routing</strong>
</span>
";
        
        $__internal_a0012df4e72668a7d3d05014e14882c8a1d85c1e9c44d8f78366892278759d27->leave($__internal_a0012df4e72668a7d3d05014e14882c8a1d85c1e9c44d8f78366892278759d27_prof);

    }

    // line 12
    public function block_panel($context, array $blocks = array())
    {
        $__internal_743cb3e4e4eab638c2ed1e9b1de528e078658ba69187b0c4bdf8ca3f32848ab8 = $this->env->getExtension("Symfony\\Bridge\\Twig\\Extension\\ProfilerExtension");
        $__internal_743cb3e4e4eab638c2ed1e9b1de528e078658ba69187b0c4bdf8ca3f32848ab8->enter($__internal_743cb3e4e4eab638c2ed1e9b1de528e078658ba69187b0c4bdf8ca3f32848ab8_prof = new Twig_Profiler_Profile($this->getTemplateName(), "block", "panel"));

        // line 13
        echo "    ";
        echo $this->env->getExtension('Symfony\Bridge\Twig\Extension\HttpKernelExtension')->renderFragment($this->env->getExtension('Symfony\Bridge\Twig\Extension\RoutingExtension')->getPath("_profiler_router", array("token" => (isset($context["token"]) ? $context["token"] : $this->getContext($context, "token")))));
        echo "
";
        
        $__internal_743cb3e4e4eab638c2ed1e9b1de528e078658ba69187b0c4bdf8ca3f32848ab8->leave($__internal_743cb3e4e4eab638c2ed1e9b1de528e078658ba69187b0c4bdf8ca3f32848ab8_prof);

    }

    public function getTemplateName()
    {
        return "@WebProfiler/Collector/router.html.twig";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  73 => 13,  67 => 12,  56 => 7,  53 => 6,  47 => 5,  36 => 3,  11 => 1,);
    }

    public function getSource()
    {
        return "{% extends '@WebProfiler/Profiler/layout.html.twig' %}

{% block toolbar %}{% endblock %}

{% block menu %}
<span class=\"label\">
    <span class=\"icon\">{{ include('@WebProfiler/Icon/router.svg') }}</span>
    <strong>Routing</strong>
</span>
{% endblock %}

{% block panel %}
    {{ render(path('_profiler_router', { token: token })) }}
{% endblock %}
";
    }
}
